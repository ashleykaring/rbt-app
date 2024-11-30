import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
    group_code: String,
    name: String,
    users: [mongoose.Types.ObjectId],
});

export {GroupSchema as GroupSchema};


