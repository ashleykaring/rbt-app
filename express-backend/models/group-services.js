import mongoose from "mongoose";
import { GroupSchema } from "./groups.js";
import { addGroupToUser } from "./user-services.js";

import dotenv from "dotenv";
dotenv.config();

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

async function createGroup(group) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );
    const groupCreatorId = group.users[0];
    try {
        const groupToAdd = new groupModel(group);
        const savedGroup = await groupToAdd.save();
        addGroupToUser(groupCreatorId, savedGroup._id);
        return savedGroup;
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function findGroupByCode(code) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );
    return await groupModel.find({ group_code: code });
}

async function findGroupById(id) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );
    return await groupModel.find({ _id: id });
}

async function joinGroup(userId, groupId) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );

    try {
        const updatedGroup = await groupModel.findOneAndUpdate(
            { _id: groupId },
            { $push: { users: userId } },
            { new: true }
        );

        if (!updatedGroup) {
            return false;
        }

        return await addGroupToUser(userId, groupId);
    } catch (error) {
        console.log(error);
        return false;
    }
}

export {
    createGroup,
    findGroupByCode,
    findGroupById,
    joinGroup
};
