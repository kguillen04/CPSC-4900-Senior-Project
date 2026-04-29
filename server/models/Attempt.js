import mongoose from "mongoose";

/**
 * Attempt Model
 * 
 * Represents a single user interaction with a question. 
 * Each document captures the context and outcome of a user's response,
 * and is used to track performance and update mastery levels.
 * 
 * Relationships:
 * - userId: References the User who made the attempt.
 * - questionId: References the Question that was attempted.
 * 
 * This model is central to:
 * - Tracking learner performance over time
 * - Computing mastery updates
 * - Avoiding repeated questions during selection
*/

const attemptSchema = new mongoose.Schema(
    {
        /**
         * The user who made the attempt.
        */
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        /**
         * The question that was attempted.
        */
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
            index: true,
        },

        /**
         * Concept category of the question (e.g., variables, conditionals, loops)
        */
        concept: {
            type: String,
            required: true,
            index: true,
        },

        /**
         * Difficulty level of the question (1 = easiest, 5 = hardest).
        */
        difficulty: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            index: true,
        },

        /**
         * Index of the answer choice selected by the user.
        */
        selectedIndex: {
            type: Number,
            required: true,
            min:0,
        },

        /**
         * Whether the user's answer was correct or not.
        */
        correct: {
            type: Boolean,
            required: true,
            index: true,
        },
    },

    /**
     * Automatically adds:
     * - createdAt: Timestamp of when the attempt was made.
     * - updatedAt: Timestamp of the last update to the attempt.
    */
    { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);