import mongoose from "mongoose";
import { GroupSchema, MemberSchema} from "./user.js";
import { addGroupToUser } from "./user-services.js";

import dotenv from "dotenv";
dotenv.config();

let dbConnection;

// Helper function to connect to the database 

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

// Creates a group document

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

// Finds a group document from its group code

async function findGroupByCode(code) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );
    return await groupModel.find({ group_code: code });
}

// Finds a group document from its ID

async function findGroupById(id) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );
    return await groupModel.find({ _id: id });
}

// Adds a UserID to a group document's list of members 
/*
async function joinGroup(userId, groupId) {
    const groupModel = getDbConnection().model(
        "groups",
        GroupSchema
    );

    try {
        await groupModel.findOneAndUpdate(
            { _id: groupId },
            {
                $push: { users: userId }
            }
        );
    } catch (error) {
        console.log(error);
        return false;
    }

    return await addGroupToUser(userId, groupId);
}
*/

async function joinGroup(userId, groupId) {
    const memberModel = getDbConnection().model(
        "members",
        MemberSchema
    );


    try {
        const memberObject = new memberModel({user_id: userId, group_id: groupId});
        const savedMember = await memberObject.save();
        return savedMember;

    } catch (err) {
        console.log(err);
        return false;

    }

}

export {
    createGroup,
    findGroupByCode,
    findGroupById,
    joinGroup
};
