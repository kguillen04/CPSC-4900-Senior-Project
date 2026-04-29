import mongoose from "mongoose";

/**
 * Question Model
 * 
 * Represents a single multiple-choice question.
 * Each document captures the question's concept, difficulty, prompt, 
 * answer choices, and the correct answer index. It is used to generate quizzes for learners.
 * 
 * Relationships:
 * - Attempts reference this model to track user interactions and performance.
 * 
 * This model is central to:
 * - Storing the question bank
 * - Providing questions for quizzes
 * - Analyzing question performance and difficulty
*/
const questionSchema = new mongoose.Schema(
    {
        /**
         * Concept category of the question (e.g., variables, conditionals, loops).
        */
        concept: {
            type: String,
            required: true,
            enum: ["variables", "conditionals", "loops"],
            index: true
        },

        /**
         * Difficulty level of the question (1 = easiest, 5 = hardest).
        */
        difficulty: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            index: true
        },

        /**
         * The text of the question prompt.
        */
        prompt: {
            type: String,
            required: true
        },

        /**
         * Array of answer choices for the question. Must have at least 2 options.
        */
        choices: {
            type: [String],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length >= 2,
                message: "choices must have at least 2 options"
            },
            required: true
        },

        /**
         * Index of the correct answer in the choices array.
        */
        correctIndex: {
            type: Number,
            required: true,
            min: 0
        },

        /**
         * Optional tags for categorization.
        */
        tags: {
            type: [String],
            default: []
        },

        /**
         * Optional explanation for the correct answer, shown after an attempt is made. 
        */
        explanation: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

/**
 * @description
 * Mongoose pre-validation hook that ensures the `correctIndex` 
 * is within the bounds of the `choices` array.
 * 
 * @returns {void}
 * Invalidates the document if the index is out of range. 
*/
questionSchema.pre("validate", function () {
    if (this.choices && Number.isInteger(this.correctIndex)) {
        if (this.correctIndex < 0 || this.correctIndex >= this.choices.length) {
            this.invalidate("correctIndex", "correctIndex must be a valid index")
        }
    }
});

export default mongoose.model("Question", questionSchema);