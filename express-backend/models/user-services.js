const mongoose = require('mongoose');
const Schema = require("./user")

const userSchema = Schema.userSchema;
const entrySchema = Schema.entrySchema;
const userEntriesSchema = Schema.userEntriesSchema;

let dbConnection;

function getDbConnection() {
    if (!dbConnection) {
        dbConnection = mongoose.createConnection("", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }); 
    }
    return dbConnection;
}
