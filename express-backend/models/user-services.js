import mongoose from "mongoose";
import {
    userSchema,
    entrySchema,
    userEntriesSchema
} from "./user.js";
import dotenv from "dotenv";
dotenv.config();

const uSchema = userSchema;
const eSchema = entrySchema;
const ueSchema = userEntriesSchema;

let dbConnection;

function getDbConnection() {
    if (!dbConnection) {
        dbConnection = mongoose.createConnection(
            process.env.MONGODB_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
    }
    return dbConnection;
}

async function addUser(user) {
    const userModel = getDbConnection().model("users", uSchema);
    try {
        const userToAdd = new userModel(user);
        userToAdd.entries = await addUserEntries(userToAdd._id);
        const savedUser = await userToAdd.save();
        return savedUser;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function addEntry(entry) {
    const entryModel = getDbConnection().model(
        "rbt_entries",
        eSchema
    );
    try {
        const entryToAdd = new entryModel(entry);
        const savedEntry = await entryToAdd.save();
        addEntryToEntries(savedEntry._id, entry.user_id);
        return savedEntry;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function addEntryToEntries(id, userid) {
    const userEntriesModel = getDbConnection().model(
        "user_entries",
        ueSchema
    );

    const finalEntries =
        await userEntriesModel.findOneAndUpdate(
            { user_id: userid },
            {
                $push: { entries: id }
            }
        );

    return finalEntries;
}

async function addUserEntries(id) {
    const userEntriesModel = getDbConnection().model(
        "user_entries",
        ueSchema
    );

    const defaultEntries = {
        user_id: id
    };
    try {
        const userEntriesToAdd = new userEntriesModel(
            defaultEntries
        );
        const savedEntries = await userEntriesToAdd.save();
        return savedEntries._id;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function findUserByUsername(username) {
    const userModel = getDbConnection().model("users", uSchema);
    return await userModel.find({ username: username });
}

async function findUserById(id) {
    const userModel = getDbConnection().model("users", uSchema);
    return await userModel.find({ _id: id });
}

async function getAllEntries(userid) {
    console.log("Getting entries for user:", userid);
    const entryModel = getDbConnection().model(
        "rbt_entries",
        eSchema
    );

    // Convert string ID to MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(userid);
    console.log("Converted ObjectId:", objectId);

    const entries = await entryModel.find({
        user_id: objectId
    });
    console.log("Found entries:", entries);
    return entries;
}

export {
    addUser,
    findUserByUsername,
    addEntry,
    getAllEntries,
    findUserById
};
