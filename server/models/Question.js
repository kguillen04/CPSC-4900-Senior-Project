import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
    {
        concept: {
            type: String,
            required: true,
            enum: ["variables", "conditionals", "loops"],
            index: true
        },

        difficulty: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            index: true
        },

        prompt: {
            type: String,
            required: true
        },

        choices: {
            type: [String],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length >= 2,
                message: "choices must have at least 2 options"
            },
            required: true
        },

        correctIndex: {
            type: Number,
            required: true,
            min: 0
        },

        tags: {
            type: [String],
            default: []
        },

        explanation: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

questionSchema.pre("validate", function (next) {
    if (this.choices && Number.isInteger(this.correctIndex)) {
        if (this.correctIndex < 0 || this.correctIndex >= this.choices.length) {
            this.invalidate("correctIndex", "correctIndex must be a valid index")
        }
    }
    next();
});

export default mongoose.model("Question", questionSchema);