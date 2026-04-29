import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js"

const router = express.Router();

/**
 * POST /api/auth/register
 * 
 * Registers a new user account.
 * 
 * Expected body request:
 * - firstName: user's first name
 * - lastName: user's last name
 * - email: user's email address
 * - password: user's password
 * 
 * Workflow:
 * 1. Validates that all required fields are present.
 * 2. Checks if a user with the provided email already exists.
 * 3. Hashes the password using bcrypt for secure storage.
 * 4. Creates a new User document in the database.
 * 5. Returns a success message and the new user's ID.
 * 
 * Response:
 * - message: success message confirming registration
 * - userId: MongoDB ObjectId of the created User document
 * - firstName: the registered user's first name
 * - lastName: the registered user's last name
 * - email: the registered user's email address
 * 
 * Error handling:
 * - 400 Bad Request for missing fields.
 * - 409 Conflict if a user with the email already exists.
 * - 500 Server Error for unexpected issues during registration.
*/
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName,email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "All fields required"});
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email,
            passwordHash
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

/**
 * POST /api/auth/login
 * 
 * Authenticates a user and returns their profile information.
 * 
 * Expected body request:
 * - email: user's email address
 * - password: user's password
 * 
 * Workflow:
 * 1. Validates that both email and password are provided.
 * 2. Retrieves the User document matching the provided email.
 * 3. Compares the provided password with the stored password hash using bcrypt.
 * 4. If authentication is successful, returns the user's profile information.
 * 
 * Response:
 * - message: success message confirming login
 * - userId: MongoDB ObjectId of the authenticated User document
 * - firstName: the authenticated user's first name
 * - lastName: the authenticated user's last name
 * - email: the authenticated user's email address
 * 
 * Error handling:
 * - 400 Bad Request for missing fields.
 * - 401 Unauthorized for invalid credentials (email not found or password mismatch).
 * - 500 Server Error for unexpected issues during authentication.
*/
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("login successful");
        return res.json({
            message: "Login successful",
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
            email: user.email
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;