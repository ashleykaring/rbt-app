import { openDB } from "idb";

const DB_NAME = "rbtApp";
const DB_VERSION = 1;

// Database initialization
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
                groupStore.createIndex("users", "users", {
                    multiEntry: true
                });
            }

            // Tags store
            if (!db.objectStoreNames.contains("tags")) {
                const tagStore = db.createObjectStore("tags", {
                    keyPath: "_id"
                });
                tagStore.createIndex("user_id", "user_id");
                tagStore.createIndex("tag_name", "tag_name");
            }
        }
    });
    return db;
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

    async getByDate(userId, date) {
        const entries = await this.getAll(userId);
        return entries.find(
            (entry) =>
                new Date(entry.date).toDateString() ===
                date.toDateString()
        );
    }
};

// Groups operations
export const groupsDB = {
    async getAll(userId) {
        const db = await initDB();
        const tx = db.transaction("groups", "readonly");
        const store = tx.store;
        const groups = await store.getAll();
        return groups.filter((group) =>
            group.users.includes(userId)
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
