import express from "express";
import mongoose from "mongoose";
import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { updateUserMastery } from "../services/mastery.js";

const router = express.Router();

/**
 * POST /api/attempts
 * 
 * Records a user's attempt at answering a question, updates their mastery, and returns feedback on the attempt.
 * 
 * Expected request body:
 * - userId: MongoDB ObjectId of the user submitting the attempt
 * - questionId: MondoDB ObjectId of the attempted question
 * - selectedIndex: index of the answer choice selected by the user
 * - responseTimeMs: optional response time in milliseconds
 * 
 * Workflow:
 * 1. Validates required fields and ObjectId formats.
 * 2. Retrieves the corresponding Question and User documents.
 * 3. Checks if the selected answer is correct.
 * 4. Stores the attempt in the Attempt collection.
 * 5. Updates the user's mastery score for the relevant concept.
 * 6. Returns correctness, feedback, explanation, and updated mastery data.
 * 
 * Response:
 * - correct: boolean indicating if the attempt was correct
 * - correctIndex: index of the correct answer choice
 * - explanation: optional explanation for the correct answer
 * - masteryUpdate: the change in mastery score resulting from this attempt
 * - updatedMastery: the user's updated mastery array after applying the update
 * - attemptId: MongoDB ObjectId of the created Attempt document
 * 
 * Error handling:
 * - 400 Bad Request for missing fields, invalid ObjectIds, or out-of-bounds selectedIndex.
 * - 404 Not Found if the User or Question does not exist.
 * - 500 Server Error for unexpected issues during processing.
*/
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