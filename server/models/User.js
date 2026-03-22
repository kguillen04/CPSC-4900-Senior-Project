import mongoose from "mongoose";

const masterySchema = new mongoose.Schema({
    concept: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        default: 0.5, // neutral prior
        min: 0,
        max: 1
    }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },
    
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    passwordHash: { 
        type: String, 
        required: true 
    },

    bio: {
        type: String,
        required: false,
    },

    mastery: {
        type: [masterySchema],
        default: [
            { concept: "variables", score: 0.5 },
            { concept: "conditionals", score: 0.5},
            { concept: "loops", score: 0.5}
        ]
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", userSchema);