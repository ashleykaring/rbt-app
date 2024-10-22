const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    entries: {
        type: Array,
    }

});


module.exports = UserSchema;