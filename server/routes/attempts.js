import express from "express";
import mongoose from "mongoose";
import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { updateUserMastery } from "../services/mastery.js";

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
            return res.status(404).json({ error: "Question not found" })
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        if (sel >= question.choices.length) {
            return res.status(400).json({ error: "SelectedIndex is out of bounds" });
        }

        const correct = sel == question.correctIndex;

        const attempt = await Attempt.create({
            userId,
            questionId,
            concept: question.concept,
            difficulty: question.difficulty,
            selectedIndex: sel,
            correct,
            responseTimeMs,
        });

        const masteryUpdate = updateUserMastery(
            user,
            question.concept,
            correct,
            question.difficulty,
        );

        await user.save();

        console.log("Mastery update:", masteryUpdate);
        console.log("Updated mastery array:", user.mastery);

        return res.status(201).json({
            correct,
            correctIndex: question.correctIndex,
            explanation: question.explanation || "",
            masteryUpdate,
            updatedMastery: user.mastery,
            attemptId: attempt._id,
        });
    } catch (err) {
        console.error("POST /api/attempts error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;