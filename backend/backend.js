import express from "express";
import cors from 'cors';
import User from './models/user.js'
import Entry from './models/entry.js';
import Group from './models/group.js';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());


function formatDateForDatabase(date) { //database date 
  return date.toISOString().split('T')[0];
}

// create a new entry for a user
app.post("/entries", async (req, res) => {
    try {
      const { user_id, rose_text, bud_text, thorn_text, is_public } = req.body;
      const today = formatDateForDatabase(new Date()); 
        //checks if entry already exists
      const existingEntry = await Entry.findOne({
        user_id : user_id, date: today });// check for entries w same date 
      
      if (existingEntry){
        return res.status().json({
          message: "You already started an entry today",
          entry: existingEntry
        });
      }

      const newEntry = new Entry({ 
        user_id, 
        rose_text, 
        bud_text, 
        thorn_text, 
        is_public,
        date: today //database
    });
      await newEntry.save(); 

      await User.findByIdAndUpdate(user_id, { $push: { entries: newEntry._id } });
 
      res.status(201).json(newEntry);
    } catch (err) {
      res.status(500).json({ error: "Error creating journal entry" });
    }
  });


// toggles privacy status of an entry within a group
app.patch("/groups/:groupId/entries/:entryId/toggle-privacy", async (req, res) => {
  try {
    const { groupId, entryId } = req.params;
    const userId = req.body.user_id; 

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (!group.members.includes(userId)) { //checks if user is in a group
      return res.status(403).json({ error: "User not authorized in this group" });
    }
    const entry = await Entry.findById(entryId);// find entry by ID
    if (!entry || entry.group_id.toString() !== groupId) { //verifies its in a group
      return res.status(404).json({ error: "Entry not found or not part of the specified group" });
    }
    entry.is_public = !entry.is_public;
    await entry.save();

    res.status(200).json({
      message: "Privacy status toggled successfully",
      entry
    });
  } catch (err) {
    res.status(500).json({ error: "Error toggling privacy status" });
  }
});
// app.patch("/entries/:entryId/toggle-privacy", async (req, res) => {
//   try {
//     const { entryId } = req.params;
//     const userId = req.body.user_id; // Authorization by user

//     const entry = await Entry.findById(entryId);
//     if (!entry) {
//       return res.status(404).json({ error: "Entry not found" });
//     }

//     // Check if the user is the owner of the entry
//     if (entry.user_id.toString() !== userId) {
//       return res.status(403).json({ error: "User not authorized to modify this entry" });
//     }

//     // Toggle the privacy status
//     entry.is_public = !entry.is_public;
//     await entry.save();

//     res.status(200).json({
//       message: "Privacy status toggled successfully",
//       entry
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Error toggling privacy status" });
//   }
// });

//allowed to edit only within the same day
app.patch("/entries/:entryId/updateContent", async (req, res) => {
  try { // update content by entry ID

    const { rose_text, bud_text, thorn_text } = req.body;
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    const today = formatDateForDatabase(new Date());
    if (formatDateForDatabase(entry.date) !== today) { //comapres todays date deny edit if not
      return res.status(403).json({ error: "Whoops, it's too late to edit." });
    }
    if (rose_text) entry.rose_text = rose_text;
    if (bud_text) entry.bud_text = bud_text;
    if (thorn_text) entry.thorn_text = thorn_text;//updates content

    await entry.save();

    res.status(201).json({ success: true, entry });
  } catch (err) {
    res.status(500).json({ error: "Error" });
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

  return now.toLocaleDateString('en-US', options);
}
