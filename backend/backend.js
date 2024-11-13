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
 
      const today = formatDate(new Date()); //yyy-mm-dd format

      const existingEntry = await Entry.findOne({
        user_id : user_id,
        date: today // check for entries w same date 
      });

       if (existingEntry){
        return res.status(201).json({
          message: "You already started an entry today",
          entry: existingEnrty
        });
       }

      const newEntry = new Entry({ 
        user_id, 
        rose_text, 
        bud_text, 
        thorn_text, 
        is_public,
        date: today // only date
    });
      await newEntry.save(); 

      await User.findByIdAndUpdate(user_id, { $push: { entries: newEntry._id } });
 
      res.status(201).json(newEntry);
    } catch (err) {
      res.status(500).json({ error: "Error creating journal entry" });
    }
  });


// toggles privacy status of entry within a group
app.patch("/groups/:groupId/entries/:entryId/toggle-privacy", async (req, res) => {
  try {
    const { groupId, entryId } = req.params;
    const userId = req.body.user_id;

    // finds the group and verify that the user is a member
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(userId)) {
      return res.status(403).json({ error: "User is not authorized in this group" });
    }

    // Find the entry and verify ownership
    const entry = await Entry.findOne({ _id: entryId, user_id: userId, group_id: groupId });
    if (!entry) {
      return res.status(404).json({ error: "Entry not found or unauthorized" });
    }

    // Toggle the privacy setting
    entry.is_public = !entry.is_public;
    await entry.save();

    res.status(200).json({ message: "Privacy status chnaged", entry });
  } catch (err) {
    res.status(500).json({ error: "Error toggling privacy status" });
  }
});

// gets group entries for specific user
app.get("/groups/user/:userId/entries", async (req, res) => {
  try {
    const userId = req.params.userId;
    const groups = await Group.find({ members: userId }).select('_id');
    const groupIds = groups.map(group => group._id);
    const entries = await Entry.find({ group_id: { $in: groupIds } });

    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({ error: "Error fetching group entries" });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



function formatDate(date){//helper date yyy-mm-dd
  return date.toISOString().split('T')[0];
}


//allowed to edit only within the same day
app.patch("/entries/:entryId/updateContent", async (req, res) => {
  try { // update content by entry ID

    const { rose_text, bud_text, thorn_text } = req.body;
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    const today = formatDate(new Date());
    if (formatDate(entry.date) !== today) { //comapres todays date deny edit if not
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

