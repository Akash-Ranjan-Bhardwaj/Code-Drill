import jwt from "jsonwebtoken"; // Used to verify JWT tokens
import { db } from "../libs/db.js"; // Prisma database client

// ============================================
// Middleware to Authenticate Users via JWT
// ============================================
export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.jwt;

        // If token is not present, block the request
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token provided"
            });
        }

        let decoded;

        // Verify the token and decode it
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            // If token is invalid or expired, block the request
            return res.status(401).json({
                message: "Unauthorized - Invalid token"
            });
        }

        // Find the user in the database using the decoded user ID
        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        });

        // If no user is found, block the request
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user data to request object so it can be used in routes
        req.user = user;

        // Proceed to next middleware or controller
        next();

    } catch (error) {
        // Catch any unexpected errors during authentication
        console.error("Error authenticating user:", error);
        res.status(500).json({ message: "Error authenticating user" });
    }
};

// ============================================
// Middleware to Restrict Access to Admins Only
// ============================================
export const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id; // Get user ID from the request (set by authMiddleware)

        // Fetch the user's role from the database
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            select: {
                role: true
            }
        });

        // If user is not found or not an admin, block access
        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Access denied - Admins only"
            });
        }

        // Proceed if user is an admin
        next();
    } catch (error) {
        // Catch any unexpected errors
        console.error("Error checking admin role:", error);
        res.status(500).json({ message: "Error checking admin role" });
    }
};
