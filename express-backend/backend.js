/*
IMPORTS
*/

// Libraries
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Models
import {
    addUser,
    findUserByUsername,
    addEntry,
    getAllEntries,
    findUserById,
    getUserEntriesByUserId,
    getEntryById,
    EntryModel,
    addReactionToEntry
} from "./models/user-services.js";

// Services
import {
    createGroup,
    findGroupByCode,
    joinGroup,
    findGroupById
} from "./models/group-services.js";

// File Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment Variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Express App
const app = express();
const port = 8000;

// Middleware
app.use(
    cors({
        origin: "http://localhost:3000",
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

/* 
HTML ROUTES
*/

// REGISTER
/*
 * Need first name, email, and password
 * Checks if email is already in use
 * Hashes password
 * Adds user to database
 */
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
            message: "Success!",
            userId: savedUser._id
        });
    } catch (error) {
        res.status(500).json({
            message:
                "There was an error registering, please try again."
        });
    }
});

// LOGIN
/*
 * Need email and password
 * Checks if email is registered
 * Checks if password is correct
 * Returns user ID
 */
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

// CREATE ENTRY
/*
 * Need user_id, rose_text, bud_text, thorn_text, and is_public
 * Adds entry to database
 */
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

// GET USER ENTRIES
/*
 * Need user_id
 * Returns all entries for user
 */
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

// JOIN GROUP
/*
 * Need group_code and user_id
 * Adds user to group
 * Returns updated group data
 */
app.put("/groups/:groupCode/:userId", async (req, res) => {
    try {
        console.log("Join group attempt:", {
            groupCode: req.params.groupCode,
            userId: req.params.userId
        });

        // Find group by code
        const foundGroup = await findGroupByCode(
            req.params.groupCode
        );
        console.log("Found group:", foundGroup);

        // Group doesn't exist
        if (!foundGroup || foundGroup.length === 0) {
            console.log(
                "Group not found with code:",
                req.params.groupCode
            );
            return res.status(404).json({
                error: "Group not found"
            });
        }

        const group = foundGroup[0];

        // Convert string ID to MongoDB ObjectId
        const userId = new mongoose.Types.ObjectId(
            req.params.userId
        );

        // Check if user is already in group (using toString() for comparison)
        if (
            group.users.some(
                (id) => id.toString() === userId.toString()
            )
        ) {
            console.log("User already in group:", userId);
            return res.status(409).json({
                error: "You're already a member of this group"
            });
        }

        // Join group
        const updatedGroup = await joinGroup(userId, group._id);

        if (!updatedGroup) {
            console.error("Failed to join group");
            return res.status(500).json({
                error: "Failed to join group"
            });
        }

        console.log("Successfully joined group:", updatedGroup);
        res.status(200).json({
            message: "Successfully joined group",
            group: updatedGroup
        });
    } catch (err) {
        // Enhanced error logging
        console.error("Error in join group:", {
            error: err,
            message: err.message,
            stack: err.stack
        });
        res.status(500).json({
            error:
                err.message ||
                "Server error while joining group"
        });
    }
});

// VERIFY GROUP CODE
/*
 * Checks if group code is already in use
 * Returns true if code is available, false if taken
 */
app.get("/api/groups/verify/:code", async (req, res) => {
    try {
        console.log("Verifying group code:", req.params.code);
        const existingGroup = await findGroupByCode(
            req.params.code
        );

        console.log(
            "Verification result:",
            existingGroup.length === 0 ? "available" : "taken"
        );
        res.json({ isAvailable: existingGroup.length === 0 });
    } catch (err) {
        console.error("Error verifying group code:", err);
        res.status(500).json({
            error: "Error verifying group code"
        });
    }
});

// CREATE GROUP
/*
 * Need group_code, name, and user_id
 * Creates group and adds user to group
 */
app.post("/groups/:userId", async (req, res) => {
    try {
        const { group_code, name } = req.body;
        console.log("Creating group:", {
            name,
            group_code,
            userId: req.params.userId
        });

        if (!group_code || !name) {
            return res.status(400).json({
                error: "Group code and name are required"
            });
        }

        // Verify code is still available
        const existingGroup = await findGroupByCode(group_code);
        if (existingGroup.length > 0) {
            console.log(
                "Group code already in use:",
                group_code
            );
            return res.status(409).json({
                error: "Group code already in use"
            });
        }

        const group = {
            group_code,
            name,
            users: [req.params.userId]
        };

        const newGroup = await createGroup(group);
        console.log("Group created successfully:", newGroup);

        if (!newGroup) {
            return res
                .status(500)
                .json({ error: "Error creating group" });
        }

        res.status(201).json(newGroup);
    } catch (err) {
        console.error("Error in create group:", err);
        res.status(500).json({
            error: "Error creating group"
        });
    }
});

// GET USER GROUPS
/*
 * Need user_id
 * Returns all groups user is in
 */
app.get("/users/:userId/groups", async (req, res) => {
    try {
        console.log(
            "Fetching groups for userId:",
            req.params.userId
        );

        // Convert string ID to MongoDB ObjectId
        const userId = new mongoose.Types.ObjectId(
            req.params.userId
        );

        // Find user to get their groups
        const user = await findUserById(userId);
        if (!user || user.length === 0) {
            return res
                .status(404)
                .json({ error: "User not found" });
        }

        // Get full group details for each group ID
        const userGroups = await Promise.all(
            user[0].groups.map((groupId) =>
                findGroupById(groupId)
            )
        );

        // Flatten the array since findGroupById returns an array
        const groups = userGroups.map((group) => group[0]);

        console.log("Retrieved groups:", groups);
        res.json(groups);
    } catch (err) {
        console.error("Error in /users/:userId/groups:", err);
        res.status(500).json({
            error: "Error fetching groups"
        });
    }
});

// GET USER'S MOST RECENT PUBLIC POST
app.get("/users/:userId/recent", async (req, res) => {
    try {
        console.log(
            "Fetching most recent post for userId: ",
            req.params.userId
        );

        const userId = new mongoose.Types.ObjectId(
            req.params.userId
        );
        const userEntries = await getUserEntriesByUserId(
            userId
        );

        if (!userEntries) {
            return res
                .status(404)
                .json({ error: "user not found" });
        }

        const listOfEntries = userEntries[0].entries;
        console.log(userEntries);
        const userInfo = await findUserById(userId);
        const name = userInfo[0].first_name; // Access first element since findUserById returns array

        // Handle case with no entries
        if (listOfEntries.length == 0) {
            return res.json({
                userName: name,
                noEntries: true
            });
        }

        for (let i = listOfEntries.length - 1; i >= 0; i--) {
            const currentEntryId = listOfEntries[i];
            const currentEntry = await getEntryById(
                currentEntryId
            );

            if (currentEntry[0] && currentEntry[0].is_public) {
                currentEntry[0].userName = name;
                return res.json({
                    userName: name,
                    currentEntry: currentEntry[0]
                });
            }
        }

        // No public entries found
        return res.json({
            userName: name,
            noPublicEntries: true
        });
    } catch (err) {
        console.log("Error in /users/:userId/recent", err);
        res.status(500).json({
            error: "Error fetching most recent entry"
        });
    }
});

// UPDATE ENTRY
/*
 * Updates an existing entry with new rose, bud, and thorn text & public status
 */
app.patch("/entries/:entryId", async (req, res) => {
    try {
        const { entryId } = req.params;
        const { rose_text, bud_text, thorn_text, is_public } =
            req.body;

        // Find the entry by ID and update it
        const updatedEntry = await EntryModel.findByIdAndUpdate(
            entryId,
            {
                rose_text,
                bud_text,
                thorn_text,
                is_public
            },
            { new: true } // Return the updated document
        );

        if (!updatedEntry) {
            return res
                .status(404)
                .json({ error: "Entry not found" });
        }

        res.status(200).json({
            message: "Entry updated successfully",
            entry: updatedEntry
        });
    } catch (error) {
        console.error("Error updating entry:", error);
        res.status(500).json({ error: "Error updating entry" });
    }
});

// ADD REACTION TO ENTRY
app.put("/entries/reaction", async (req, res) => {
    try {
        // What request object will look like

        const { entry_id, user_id, group_id, reaction_string } =
            req.body;
        if (
            !user_id ||
            !entry_id ||
            !group_id ||
            !reaction_string
        ) {
            return res
                .status(400)
                .json({ error: "All fields are required" });
        }

        const reaction = {
            group_id: group_id,
            user_reacting_id: user_id,
            reaction: reaction_string
        };

        const updatedEntry = await addReactionToEntry(
            entry_id,
            reaction
        );
        if (!updatedEntry) {
            return res
                .status(500)
                .json({ error: "Error creating entry" });
        }

        res.status(201).json(newEntry);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: "Error creating journal entry"
        });
    }
});

// LISTEN
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
