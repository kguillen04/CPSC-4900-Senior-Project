import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";
import Question from "../models/Question.js";
import { getMasteryScore } from "../services/mastery.js";
import { nextQuestion } from "../services/question.js"

const router = express.Router();

router.get("/next", async (req, res) => {
    try {
        const { userId, concept } = req.query;

        if (!userId || !concept) {
            return res.status(400).json({
                error: "userId and concept query parameters are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                error: "Invalid userId" 
            });
        }

        const normalizedConcept = concept.toLowerCase();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                error: "User not found" 
            });
        }

        const mastery = getMasteryScore(user, normalizedConcept);

        const result = await nextQuestion(userId, normalizedConcept, mastery);
        console.log("Next question result:", result);
        
        return res.json({
            concept: normalizedConcept,
            mastery,
            selectedDifficulty: result.targetDifficulty,
            strategy: result.strategy,
            question: {
                _id: result.question._id,
                concept: result.question.concept,
                difficulty: result.question.difficulty,
                prompt: result.question.prompt,
                choices: result.question.choices,
            },
        });
    } catch (err) {
        console.error("GET /questions/next error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;