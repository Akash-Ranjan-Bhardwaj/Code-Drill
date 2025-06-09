import bcrypt from "bcryptjs"; // For hashing passwords
import { db } from "../libs/db.js"; // Prisma database client
import { UserRole } from "../generated/prisma/index.js"; // Enum for user roles
import jwt from "jsonwebtoken"; // For generating JWT tokens

// ==============================
// Register a New User
// ==============================
export const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if a user with the given email already exists
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        // Hash the user's password before saving to DB
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user in database with role USER
        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER
            }
        });

        // Create a JWT token containing user ID, valid for 7 days
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Set the JWT token as a cookie in the response
        res.cookie("jwt", token, {
            httpOnly: true, // Cannot be accessed via JS
            sameSite: "strict", // Prevent CSRF
            secure: process.env.NODE_ENV !== "development", // Only send on HTTPS in production
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        // Respond with created user info (excluding password)
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            error: "Error creating user"
        });
    }
};

// ==============================
// User Login
// ==============================
export const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password,"checking");
    try {
        // Find user by email
        const user = await db.user.findUnique({
            where: { email }
        });

        // If user not found, return error
        if (!user) {
            return res.status(401).json({
                error: "User not found"
            });
        }

        // Compare provided password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);

        // If password doesn't match, return error
        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        // Set token in HTTP-only cookie
        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        });

        // Respond with user info
        res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            error: "Error logging in user"
        });
    }
};

// ==============================
// User Logout
// ==============================
export const logout = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development",
        });

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({
            error: "Error logging out user"
        });
    }
};

// ==============================
// Check Authenticated User
// ==============================
export const check = async (req, res) => {
    try {
        // Send back authenticated user (assumes middleware sets req.user)
        res.status(200).json({
            success: true,
            message: "User authenticated successfully",
            user: req.user
        });
    } catch (error) {
        console.error("Error checking user:", error);
        res.status(500).json({
            error: "Error checking user"
        });
    }
};
