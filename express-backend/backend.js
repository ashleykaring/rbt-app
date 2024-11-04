import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
    addUser,
    findUserByUsername,
    addEntry,
    getAllEntries
} from "./models/user-services.js";
import { userSchema, entrySchema } from "./models/user.js";

const app = express();
const port = 8000;

app.use(
    cors({
        origin: "http://localhost:3000", // Your React frontend URL
        credentials: true
    })
);
app.use(express.json());

// After dotenv.config()
console.log("MongoDB URI:", process.env.MONGODB_URI);

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) =>
        console.error("MongoDB connection error:", err)
    );

// Create a new entry for a user
app.post("/entries", async (req, res) => {
    try {
        const {
            user_id,
            rose_text,
            bud_text,
            thorn_text,
            is_public
        } = req.body;
        if (
            !user_id ||
            !rose_text ||
            !bud_text ||
            !thorn_text
        ) {
            return res
                .status(400)
                .json({ error: "All fields are required" });
        }

        const entry = {
            user_id,
            rose_text,
            bud_text,
            thorn_text,
            is_public,
            date: Date.now()
        };

        const newEntry = await addEntry(entry);
        if (!newEntry) {
            return res
                .status(500)
                .json({ error: "Error creating entry" });
        }

        res.status(201).json(newEntry);
    } catch (err) {
        res.status(500).json({
            error: "Error creating journal entry"
        });
    }
});

// Login routes
app.post("/api/register", async (req, res) => {
    const { email, password, first_name } = req.body;

    try {
        const existingUser = await findUserByUsername(email);
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: "This email is already in use!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username: email,
            password: hashedPassword,
            first_name
        };

        const savedUser = await addUser(newUser);
        if (!savedUser) {
            return res.status(500).json({
                message: "Error creating user"
            });
        }

        res.status(201).json({
            message: "Success!"
        });
    } catch (error) {
        res.status(500).json({
            message:
                "There was an error registering, please try again."
        });
    }
});

app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const users = await findUserByUsername(email);
        if (users.length === 0) {
            return res.status(400).json({
                message:
                    "Account with this email address is not registered"
            });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        res.status(200).json({
            message: "Success",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging you in. Please try again"
        });
    }
});

// Get user entries
app.get("/users/:userId/entries", async (req, res) => {
    try {
        console.log(
            "Fetching entries for userId:",
            req.params.userId
        );
        const entries = await getAllEntries(req.params.userId);
        console.log("Retrieved entries:", entries);
        res.json(entries);
    } catch (err) {
        console.error("Error in /users/:userId/entries:", err);
        res.status(500).json({
            error: "Error fetching entries"
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
