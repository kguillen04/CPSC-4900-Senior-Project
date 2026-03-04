import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            required: true,
            index: true,
        },

        concept: {
            type: String,
            required: true,
            index: true,
        },

        difficulty: {
            type: Number,
            required: true,
            min: 1,
            max: 1,
            index: true,
        },

        selectedIndex: {
            type: Number,
            required: true,
            min:0,
        },

        correct: {
            type: Boolean,
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);