import React, { useState, useEffect } from "react";
import NewEntry from "./NewEntry";
import axios from "axios";
import "./Entry.css";

function EntryPage() {
    const [entries, setEntries] = useState([]);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            setUserId(currentUserId);
            fetchUserEntries(currentUserId);
        } else {
            console.error("No user ID found in localStorage");
        }
    }, []);

    const fetchUserEntries = async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/users/${userId}/entries`
            );
            setEntries(response.data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    };

    const togglePrivacy = async (entryId, groupId) => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/groups/${groupId}/entries/${entryId}/toggle-privacy`,
                { user_id: userId } // sends user ID for authorization
            );
            const updatedEntry = response.data.entry;
            setEntries((prevEntries) =>
                prevEntries.map((entry) =>
                    entry._id === entryId ? { ...entry, is_public: updatedEntry.is_public } : entry
                )
            );
        } catch (error) {
            console.error("Error toggling privacy status:", error);
        }
    };
    

    async function makePostCall(entry) {
        try {
            const entryWithUser = {
                ...entry,
                user_id: userId
            };

            const response = await axios.post(
                "http://localhost:8000/entries",
                entryWithUser
            );

            if (response.status === 201) {
                await fetchUserEntries(userId);
            }

            return response;
        } catch (error) {
            console.error("Error creating entry:", error);
            return false;
        }
    }

    function handleSubmit(entry) {
        if (!userId) {
            console.error("No user ID available");
            return;
        }

        makePostCall(entry).then((result) => {
            if (result && result.status === 201) {
                setEntries([result.data, ...entries]);
            }
        });
    }

    return (
        <div className="entry-page">
            <h1 className="entry-header">New Journal Entry</h1>
            <NewEntry handleSubmit={handleSubmit} />
            {entries.length > 0 && (
                <div className="entries-list">
                    <h2>Most Recent Entry</h2>
                    {entries.map((entry) => (
                        <div key={entry._id} className="entry-card">
                        <div className="entry-item">
                            <h3>Rose</h3>
                            <p>{entry.rose_text}</p>
                        </div>
                        <div className="entry-item">
                            <h3>Bud</h3>
                            <p>{entry.bud_text}</p>
                        </div>
                        <div className="entry-item">
                            <h3>Thorn</h3>
                            <p>{entry.thorn_text}</p>
                        </div>
                        <button onClick={()=> togglePrivacy(entry._id, entry.group_id)}>
                            {entry.is_public ? "Make Private" : "Make Public"}
                        </button>
                    </div>
                  ))}
                </div>
            )}
        </div>
    );
}

export default EntryPage;
