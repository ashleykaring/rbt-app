// -=- Where you need to put everything for the IndexedDB
import { openDB } from "idb";

// Do not change these for now
const DB_NAME = "rbtApp";
const DB_VERSION = 5;

// Database initialization
/*
I did my best to make this include everything. It is possible that you may need to add something. This runs once when the app is loaded intiially, and basiclaly just creates the database. So if you're trying to access a field, or add a field, it needs to be in here or the IndexedDB will not know it exists.
*/
export const initDB = async () => {
    const db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Users store
            if (!db.objectStoreNames.contains("users")) {
                const userStore = db.createObjectStore(
                    "users",
                    { keyPath: "_id" }
                );
                userStore.createIndex("username", "username", {
                    unique: true
                });
            }

            // Entries store
            if (!db.objectStoreNames.contains("entries")) {
                const entryStore = db.createObjectStore(
                    "entries",
                    { keyPath: "_id" }
                );
                entryStore.createIndex("user_id", "user_id");
                entryStore.createIndex("date", "date");
                entryStore.createIndex("tags", "tags", {
                    multiEntry: true
                });
            }

            // Groups store
            if (!db.objectStoreNames.contains("groups")) {
                const groupStore = db.createObjectStore(
                    "groups",
                    { keyPath: "_id" }
                );
                groupStore.createIndex(
                    "group_code",
                    "group_code",
                    { unique: true }
                );
                groupStore.createIndex("name", "name");
            }

            // Tags store
            if (!db.objectStoreNames.contains("tags")) {
                const tagStore = db.createObjectStore("tags", {
                    keyPath: "_id"
                });
                tagStore.createIndex("user_id", "user_id");
                tagStore.createIndex("tag_name", "tag_name");
            }

            // Members store
            if (!db.objectStoreNames.contains("members")) {
                const memberStore = db.createObjectStore("members", {
                    keyPath: "_id"
                });
                memberStore.createIndex("user_id", "user_id");
                memberStore.createIndex("group_id", "group_id");
            }
        }
    });
    return db;
};

/*
Below this are all the operations that can then be performed on the database. I just generated some of the common ones, but you will certainly need to add more. The functions SHOULD match the database calls, because any call you make to the cloud database, should be first made to this, and then the cloud, and then this again.
*/

// User operations
export const userDB = {
    async get(userId) {
        const db = await initDB();
        return db.get("users", userId);
    },

    async update(user) {
        const db = await initDB();
        return db.put("users", user);
    }
};

// Entries operations
export const entriesDB = {
    async getAll(userId) {
        const db = await initDB();
        const tx = db.transaction("entries", "readonly");
        const index = tx.store.index("user_id");
        return index.getAll(userId);
    },

    async getMostRecent(userId) {
        const entries = await this.getAll(userId);
        return (
            entries.sort((a, b) => b.date - a.date)[0] || null
        );
    },

    async add(entry) {
        const db = await initDB();
        return db.add("entries", entry);
    },

    async update(entry) {
        const db = await initDB();
        return db.put("entries", entry);
    },

    async getByDate(userId, date = new Date()) {
        const entries = await this.getAll(userId);
        return entries.find(
            (entry) =>
                new Date(entry.date).toDateString() ===
                date.toDateString()
        );
    },

    async getTodaysEntry(userId) {
        return this.getByDate(userId, new Date());
    },

    async getMostRecentByUserId(userId) {
        const entries = await this.getAll(userId);
        const filteredEntries = entries.filter((entry) => entry.user_id === userId);

        let maxDateEntry = filteredEntries.length > 0 ? filteredEntries[0]: null;

        for (let i = 0; i<filteredEntries.length; i++) {
            if (filteredEntries[i].date > maxDateEntry) maxDateEntry = filteredEntries[i];

        }

        return maxDateEntry;

        
    },
};

// Groups operations
export const groupsDB = {


    async getById(groupId) {
        const db = await initDB();
        const tx = db.transaction("groups", "readonly");
        const store = tx.store;
        const groups = await store.getAll();
        return groups.filter((group) => 
            group._id.includes(groupId)
        );
    },

    async add(group) {
        const db = await initDB();
        return db.add("groups", group);
    },

    async update(group) {
        const db = await initDB();
        return db.put("groups", group);
    }
};

export const membersDB = {
    async getGroupIds(userId) {
        const db = await initDB();
        const tx = db.transaction("members", "readonly");
        const store = tx.store;
        const members = await store.getAll();
        return members.filter((memberObject) =>
            memberObject.user_id.includes(userId)
        );
    },

    async getUserIds(groupId) {
        const db = await initDB();
        const tx = db.transaction("members", "readonly");
        const store = tx.store;
        const members = await store.getAll();
        return members.filter((memberObject) => 
            memberObject.group_id.includes(groupId)
        );
    },

    async add(memberObject) {        

        const db = await initDB();
        return db.add("members", memberObject);
    },

    async delete(memberId) {
        const db = await initDB();
        return db.delete({_id: memberId});
    }
}

// Tags operations
export const tagsDB = {
    async getAll(userId) {
        const db = await initDB();
        const tx = db.transaction("tags", "readonly");
        const index = tx.store.index("user_id");
        return index.getAll(userId);
    },

    async add(tag) {
        const db = await initDB();
        return db.add("tags", tag);
    }
};
