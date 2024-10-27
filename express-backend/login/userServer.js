/*
IMPORTS
*/
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // For password hashing
const cors = require("cors");
const app = express();

/*
MAIN CODE
*/
// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/RBD-Users")
    .then(() => console.log("MongoDB connected"))
    .catch((err) =>
        console.error("MongoDB connection error:", err)
    );

// Define User schema and model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

/*
ROUTES
*/
// POST: Create a new account
app.post("/api/register", async (req, res) => {
    const { email, password, first_name } = req.body;
    console.log("Received registration request for:", {
        email,
        first_name
    });

    try {
        // Check if user already exists
        console.log(
            "Checking for existing user with email:",
            email
        );
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(
                "User already exists with email:",
                email
            );
            return res.status(400).json({
                message: "This email is already in use!"
            });
        }

        // Hash the password
        console.log("Hashing password for new user");
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        console.log("Creating new user:", {
            email,
            first_name
        });
        const newUser = new User({
            email,
            password: hashedPassword,
            first_name
        });
        await newUser.save();
        console.log("Successfully created new user:", {
            email,
            first_name
        });

        res.status(201).json({
            message: "Success!"
        });
    } catch (error) {
        console.error("Error during registration:", {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            message:
                "There was an error registering, please try again."
        });
    }
});

// POST: Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request for email:", email);

    try {
        // Find user by email
        console.log("Searching for user with email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("No user found with email:", email);
            return res.status(400).json({
                message:
                    "Account with this email address is not registered"
            });
        }

        // Compare password
        console.log("Verifying password for user:", email);
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );
        if (!isPasswordValid) {
            console.log(
                "Invalid password attempt for user:",
                email
            );
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        console.log("Successful login for user:", email);
        res.status(200).json({
            message: "Success"
        });
    } catch (error) {
        console.error("Login error:", {
            error: error.message,
            stack: error.stack
        });
        res.status(500).json({
            message: "Error logging you in. Please try again"
        });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
