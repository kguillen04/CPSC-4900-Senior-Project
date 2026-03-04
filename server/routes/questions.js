import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

router.get("/next", async (req, res) => {
    try {
        const { concept, difficulty } = req.query;

        const filter = {};
        if (concept) filter.concept = concept;
        if (difficulty) filter.difficulty = Number(difficulty);

        const results = await Question.aggregate([
            { $match: filter },
            { $sample: { size: 1 } },
            {
                $project: {
                    concept: 1,
                    difficulty: 1,
                    prompt: 1,
                    choices: 1
                }
            }
        ]);

        if (!results.length) {
            return res.status(404).json({ error: "No matching questions found" });
        }

        res.json(results[0]);
    } catch (err) {
        console.error("GET /questions/next error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;