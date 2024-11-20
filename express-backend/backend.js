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
import cookieParser from "cookie-parser";

// Models
import {
    addUser,
    findUserByUsername,
    addEntry,
    getAllEntries,
    findUserById,
    getUserEntriesByUserId,
    getEntryById,
    EntryModel
} from "./models/user-services.js";

// Services
import {
    createGroup,
    findGroupByCode,
    joinGroup,
    findGroupById
} from "./models/group-services.js";

// JWT Utils
import {
    createToken,
    setTokenCookie
} from "./utils/jwt-utils.js";

// Auth Middleware
import { authMiddleware } from "./middleware/auth.js";

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
app.use(cookieParser());

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

/*
ACCOUNT
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

        // Create and set JWT token
        const token = createToken(savedUser._id);
        setTokenCookie(res, token);

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

// CHECK IF USER EXISTS
/*
 * Need email
 * Checks if email is registered
 * Returns boolean indicating existence
 */
app.get("/api/user-exists/:email", async (req, res) => {
    const { email } = req.params;

    try {
        const users = await findUserByUsername(email);
        if (users.length === 0) {
            return res.status(200).json({
                exists: false
            });
        }

        res.status(200).json({
            exists: true,
            firstName: users[0].first_name
        });
    } catch (error) {
        res.status(500).json({
            message:
                "Error checking user existence. Please try again."
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

        // Create and set JWT token
        const token = createToken(user._id);
        setTokenCookie(res, token);

        res.status(200).json({
            message: "Success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging you in. Please try again"
        });
    }
});

/*
ENTRIES
*/

// CREATE ENTRY
/*
 * Need user_id, rose_text, bud_text, thorn_text, and is_public
 * Adds entry to database
 */
app.post("/api/entries", authMiddleware, async (req, res) => {
    try {
        const { rose_text, bud_text, thorn_text, is_public } =
            req.body;
        const userId = new mongoose.Types.ObjectId(req.userId);

        if (!rose_text || !bud_text || !thorn_text) {
            return res
                .status(400)
                .json({ error: "All fields are required" });
        }

        const entry = {
            user_id: userId,
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

// UPDATE ENTRY
/*
 * Updates an existing entry with new rose, bud, and thorn text & public status
 */
app.patch(
    "/api/entries/:entryId",
    authMiddleware,
    async (req, res) => {
        try {
            const { entryId } = req.params;
            const {
                rose_text,
                bud_text,
                thorn_text,
                is_public
            } = req.body;
            const userId = new mongoose.Types.ObjectId(
                req.userId
            );

            // Verify the entry belongs to the user
            const entry = await EntryModel.findById(entryId);
            if (!entry) {
                return res
                    .status(404)
                    .json({ error: "Entry not found" });
            }

            if (
                entry.user_id.toString() !== userId.toString()
            ) {
                return res.status(403).json({
                    error: "Not authorized to edit this entry"
                });
            }

            const updatedEntry =
                await EntryModel.findByIdAndUpdate(
                    entryId,
                    {
                        rose_text,
                        bud_text,
                        thorn_text,
                        is_public
                    },
                    { new: true }
                );

            res.status(200).json({
                message: "Entry updated successfully",
                entry: updatedEntry
            });
        } catch (error) {
            console.error("Error updating entry:", error);
            res.status(500).json({
                error: "Error updating entry"
            });
        }
    }
);

// GET USER ENTRIES
/*
 * Need user_id
 * Returns all entries for user
 */
app.get("/api/entries", authMiddleware, async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        console.log("Fetching entries for userId:", userId);

        const entries = await getAllEntries(userId);
        console.log("Retrieved entries:", entries);
        res.json(entries);
    } catch (err) {
        console.error("Error fetching entries:", err);
        res.status(500).json({
            error: "Error fetching entries"
        });
    }
});

/*
GROUPS
*/

// JOIN GROUP
/*
 * Need group_code and user_id
 * Adds user to group
 * Returns updated group data
 */
app.put(
    "/api/groups/:groupCode",
    authMiddleware,
    async (req, res) => {
        try {
            // Get userId from middleware
            const userId = new mongoose.Types.ObjectId(
                req.userId
            );
            const { groupCode } = req.params;

            console.log("Join group attempt:", {
                groupCode: req.params.groupCode,
                userId: userId
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
                return res
                    .status(404)
                    .json({ error: "Group not found" });
            }

            const group = foundGroup[0];

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
            const updatedGroup = await joinGroup(
                userId,
                group._id
            );

            if (!updatedGroup) {
                console.error("Failed to join group");
                return res.status(500).json({
                    error: "Failed to join group"
                });
            }

            console.log(
                "Successfully joined group:",
                updatedGroup
            );
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
    }
);

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
app.post("/api/groups", authMiddleware, async (req, res) => {
    try {
        const { group_code, name } = req.body;
        // Get userId from middleware and convert to ObjectId
        const userId = new mongoose.Types.ObjectId(req.userId);

        console.log("Creating group:", {
            name,
            group_code,
            userId
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
            users: [userId]
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
app.get("/api/groups", authMiddleware, async (req, res) => {
    try {
        console.log("Fetching groups for userId:", req.userId);

        // Convert string ID to MongoDB ObjectId
        const userId = new mongoose.Types.ObjectId(req.userId);

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
        console.error("Error in /api/groups:", err);
        res.status(500).json({
            error: "Error fetching groups"
        });
    }
});

// GET USER'S MOST RECENT PUBLIC POST
/*
 * Need user_id
 * Returns most recent public entry for user
 */
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
        const name = userInfo[0].first_name;

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

// GET GROUP ENTRIES
app.get(
    "/api/groups/:groupId/entries",
    authMiddleware,
    async (req, res) => {
        try {
            // Get group and verify it exists
            const groupId = new mongoose.Types.ObjectId(
                req.params.groupId
            );
            const group = await findGroupById(groupId);

            if (!group || group.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Group not found" });
            }

            // Get recent entries for all users in one query
            const recentEntries = await Promise.all(
                group[0].users.map(async (userId) => {
                    const userEntries =
                        await getUserEntriesByUserId(userId);
                    const userInfo = await findUserById(userId);

                    if (
                        !userEntries ||
                        !userEntries[0] ||
                        !userEntries[0].entries
                    ) {
                        return null;
                    }

                    const listOfEntries =
                        userEntries[0].entries;
                    const name = userInfo[0].first_name;

                    // Find most recent public entry
                    for (
                        let i = listOfEntries.length - 1;
                        i >= 0;
                        i--
                    ) {
                        const currentEntry = await getEntryById(
                            listOfEntries[i]
                        );
                        if (
                            currentEntry[0] &&
                            currentEntry[0].is_public
                        ) {
                            return {
                                userId,
                                userName: name,
                                ...currentEntry[0]._doc
                            };
                        }
                    }
                    return null;
                })
            );

            // Filter out null entries and send
            res.json(
                recentEntries.filter((entry) => entry !== null)
            );
        } catch (error) {
            console.error(
                "Error fetching group entries:",
                error
            );
            res.status(500).json({
                error: "Failed to fetch group entries"
            });
        }
    }
);

// LISTEN
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
