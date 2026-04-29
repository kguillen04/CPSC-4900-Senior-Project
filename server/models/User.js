import mongoose from "mongoose";

/**
 * Mastery Model
 * 
 * Represents a user's proficiency with a specific concept. 
 * Each document captures the concept name and a mastery score between 0 and 1.
 * 
 * Relationships:
 * - Embedded within the User model to track mastery across multiple concepts.
 * 
 * This model is central to:
 * - Storing and updating mastery scores for each concept
 * - Informing quiz generation based on user proficiency
 * - Analyzing learning progress over time
 */
const masterySchema = new mongoose.Schema({
    /**
     * The name of the concept (e.g., variables, conditionals, loops).
    */
    concept: {
        type: String,
        required: true
    },

    /**
     * The user's mastery score for the concept, normalized between 0 and 1.
    */
    score: {
        type: Number,
        default: 0.5, // neutral prior
        min: 0,
        max: 1
    }
});

/**
 * User Model
 * 
 * Represents a user.
 * Each document contains the user's name, email, password hash, 
 * and mastery scores for each concept. It is used to manage user accounts,
 * track learner progress, and personalize quiz generation.
 *  
 * Relationships: 
 * - Attempts reference this model to track user interactions and performance.
 * 
 * This model is central to:
 * - User authentication and profile management
 * - Storing and updating mastery scores
 * - Personalizing quiz content based on mastery levels
*/
const userSchema = new mongoose.Schema({
    /**
     * The user's first and last name.
    */
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },
    
    /**
     * The user's email address, used for login and communication.
    */
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    /**
     * The user's password hash, stored securely for authentication purposes.
    */
    passwordHash: { 
        type: String, 
        required: true 
    },

    /**
     * The user's optional bio or profile description.
    */
    bio: {
        type: String,
        required: false,
    },

    /**
     * Array of mastery entries, each representing the user's proficiency with a specific concept.
    */
    mastery: {
        type: [masterySchema],
        default: [
            { concept: "variables", score: 0.5 },
            { concept: "conditionals", score: 0.5},
            { concept: "loops", score: 0.5}
        ]
    },

    /**
     * Timestamps for when the user was created and last updated.
    */
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", userSchema);