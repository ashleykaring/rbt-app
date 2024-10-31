import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    entries: mongoose.Types.ObjectId,

});

const EntrySchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    date: Number,
    is_public: Boolean,
    rose_text: String,
    bud_text: String,
    thorn_text: String
});

const UserEntriesSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    entries: [mongoose.Types.ObjectId],
});


export {UserSchema as userSchema, EntrySchema as entrySchema, UserEntriesSchema as userEntriesSchema};
