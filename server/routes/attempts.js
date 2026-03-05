import express from "express";
import mongoose from "mongoose";
import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { userId, questionId, selectedIndex, responseTimeMs} = req.body;

        if (!userId || !questionId || selectedIndex == undefined) {
            return res.status(400).json({ error: "userId, questionId, and selectedIndex are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({ error: "Invalid userId or questionId" });
        }

        const sel = Number(selectedIndex);
        if (!Number.isInteger(sel) || sel < 0) {
            return res.status(400).json({ error: "SelectedIndex must be a non-negative integer" });
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.statys(404).json({ error: "Question not found" })
        }

        const correct = sel == question.correctIndex;

        await Attempt.create({
            userId,
            questionId,
            concept: question.concept,
            difficulty: question.difficulty,
            selectedIndex: sel,
            correct,
        });

        return res.json({
            correct,
            correctIndex: question.correctIndex,
            explanation: question.explanation || "",
        });
    } catch (err) {
        console.error("POST /api/attempts error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;