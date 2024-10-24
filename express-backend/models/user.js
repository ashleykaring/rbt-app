const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    first_name: String,
    entries: [mongoose.Types.ObjectId],

});


module.exports = UserSchema;