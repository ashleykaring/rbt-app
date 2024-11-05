import express from "express";
import cors from 'cors';
import User from './models/user.js'
// import Entry from './models/entry.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// Create a new entry for a user
app.post("/entries", async (req, res) => {
    try {
      const { user_id, rose_text, bud_text, thorn_text, is_public } = req.body;
 
      if (!user_id || !rose_text || !bud_text || !thorn_text) {
        return res.status(400).json({ error: "All fields are required" });
      }
      // Create a new entry
      const newEntry = new Entry({ 
        user_id, 
        rose_text, 
        bud_text, 
        thorn_text, 
        is_public,
        date: new Date() 
    });
      await newEntry.save(); 

      await User.findByIdAndUpdate(user_id, { $push: { entries: newEntry._id } });
 
      res.status(201).json(newEntry);
    } catch (err) {
      res.status(500).json({ error: "Error creating journal entry" });
    }
  });


  // Toggle privacy by entry ID
app.patch("/entries/:entryId/togglePrivacy", async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    entry.is_public = !entry.is_public;
    await entry.save();

    res.status(201).json({ success: true, is_public: entry.is_public });
  } catch (err) {
    res.status(500).json({ error: "Error toggling privacy" });
  }
});

// helps check if its past 11:59 pm
function isPastEditDeadline() {
  const now = new Date();
  return now.getHours() > 23 || (now.getHours() === 23 && now.getMinutes() >= 59);
}

// update content by entry ID
app.patch("/entries/:entryId/updateContent", async (req, res) => {
  try {

    if (isPastEditDeadline()) {
      return res.status(403).json({ error: "Whoops, too late to edit." });
    }

    const { rose_text, bud_text, thorn_text } = req.body;
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    // Update content fields if provided
    if (rose_text) entry.rose_text = rose_text;
    if (bud_text) entry.bud_text = bud_text;
    if (thorn_text) entry.thorn_text = thorn_text;

    await entry.save();

    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: "Error updating entry content" });
  }
});


// flag
  // returns all entries by user ID
app.get("/users/:userId/entries", async (req, res) => {
    try {
      const entries = await Entry.find({ user_id: req.params.userId });
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: "Error fetching entries" });
    }
  });

// returns a specific entry by entry ID
app.get("/entries/:entryId", async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.entryId).populate("user_id");
      if (!entry) return res.status(404).json({ error: "Entry not found" });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ error: "Error fetching entry" });
    }
  });

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });


  // Date
function getFormattedDate() {
    const now = new Date();

    const options = {
        weekday: 'long',   // "Monday"
        year: 'numeric',   // "2024"
        month: 'long',     // "October"
        day: 'numeric'     // "30"
    };

    // (only date, no time)
    return now.toLocaleDateString('en-US', options);
}

