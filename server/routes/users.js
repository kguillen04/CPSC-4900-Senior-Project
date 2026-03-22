import express from "express";
import User from "../models/User.js";

const router = express.Router();

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

export default router;