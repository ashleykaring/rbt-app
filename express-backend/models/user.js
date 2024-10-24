const mongoose = require("mongoose");

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
})


module.exports.userSchema = UserSchema;
module.exports.entrySchema = EntrySchema;
module.exports.userEntriesSchema = UserEntriesSchema;
