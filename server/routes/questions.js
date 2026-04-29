import express from "express";
import mongoose, { set } from "mongoose";
import User from "../models/User.js";
import Question from "../models/Question.js";
import { getMasteryScore } from "../services/mastery.js";
import { nextQuestion } from "../services/question.js"

const router = express.Router();

/**
 * POST /api/questions/next
 * 
 * Retrieves the next question for a user based on their mastery of a specific concept.
 * 
 * Expected body request:
 * - userId: MongoDB ObjectId of the user requesting the next question
 * - concept: the concept category for which to retrieve the next question (e.g., "variables", "loops", or "conditionals")
 * 
 * Workflow:
 * 1. Validates required fields and ObjectId format.
 * 2. Retrieves the user's current mastery score for the specified concept.
 * 3. Uses the mastery score to select an appropriate next question from the database.
 * 4. Returns the selected question along with the user's mastery and the strategy used for selection.
 * 
 * Response:
 * - concept: the requested concept category
 * - mastery: the user's current mastery score for the concept
 * - selectedDifficulty: the difficulty level of the selected question
 * - strategy: the strategy used to select the question
 * - question: an object containing the selected question's details (id, concept, difficulty, prompt, choices)
 * 
 * Error handling:
 * - 400 Bad Request for missing or invalid query parameters.
 * - 404 Not Found if the user is not found.
 * - 500 Server Error for unexpected issues during question retrieval.
*/
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