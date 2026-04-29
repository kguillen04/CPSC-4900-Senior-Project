import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * POST /api/users/:userId/profile
 * 
 * Updates a user's profile information, including their first name, last name, and bio.
 * 
 * Expected body request:
 * - firstName: user's first name (required)
 * - lastName: user's last name (required)
 * - bio: user's profile bio (optional)
 * 
 * Workflow:
 * 1. Validates that the required fields are present.
 * 2. Finds the user by their ID and updates their profile information.
 * 3. Returns the updated user profile data.
 *
 * Response:
 * - userId: MongoDB ObjectId of the updated user
 * - firstName: the updated first name
 * - lastName: the updated last name
 * - bio: the updated bio (or empty string if not provided)
 * 
 * Error handling:
 * - 400 Bad Request for missing required fields.
 * - 404 Not Found if the user does not exist.
 * - 500 Server Error for unexpected issues during profile update.
*/
router.post("/:userId/profile", async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, bio } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).json({ error: "First and last name are required."});
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                bio: bio || "",
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            userId: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            bio: updatedUser.bio,
        });
    } catch (err) {
        console.error("POST /users/:userId/profile error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

/**
 * GET /api/users/:userId/mastery
 *
 * Retrieves a user's mastery scores for all concepts.
 * This is used by the dashboard to render progress bars.
 *
 * Expected Body Request: None
 * 
 * Workflow:
 * 1. Finds the user by their ID and retrieves their mastery data.
 * 2. Transforms the mastery data into a frontend-friendly format, including:
 * - concept: the name of the concept (lowercased)
 * - score: the raw mastery score (0–1)
 * - progress: the mastery score converted to a percentage (0–100)
 * 3. Returns the transformed mastery data as an array of objects.
 * 
 * Error handling:
 * - 404 Not Found if the user does not exist.
 * - 500 Server Error for unexpected issues during data retrieval.
 * 
 * Response:
 * - mastery: array of objects
 * - concept: concept name
 * - score: raw mastery score (0–1)
 * - progress: percentage (0–100)
 */
router.get("/:userId/mastery", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("mastery");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const mastery = user.mastery.map((entry) => ({
            concept: entry.concept.toLowerCase(),
            score: entry.score,
            progress: Math.round(entry.score * 100),
        }));

        return res.json({ mastery });
    } catch (err) {
        console.error("GET /api/users/:userId/mastery error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;