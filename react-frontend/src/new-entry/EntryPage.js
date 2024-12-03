import React, { useState, useEffect, useCallback } from "react";
import NewEntry from "./NewEntry";
import axios from "axios";
import "./Entry.css";
import { FaEdit, FaTimes } from "react-icons/fa";

function EntryPage() {
    const [entries, setEntries] = useState([]);
    const [userId, setUserId] = useState("");
    const [hasSubmittedToday, setHasSubmittedToday] =
        useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableEntry, setEditableEntry] = useState({
        rose: "",
        bud: "",
        thorn: ""
    });

    const fetchUserEntries = useCallback(async (userId) => {
        try {
            const response = await axios.get(
                `http://localhost:8000/users/${userId}/entries`
            );
            console.log("Fetched entries:", response.data);
            setEntries(response.data);
            checkIfSubmittedToday(response.data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    }, []);

    useEffect(() => {
        const currentUserId = localStorage.getItem("userId");
        if (currentUserId) {
            setUserId(currentUserId);
            fetchUserEntries(currentUserId);
        } else {
            console.error("No user ID found in localStorage");
        }
    }, [fetchUserEntries]);

    const checkIfSubmittedToday = (entries) => {
        if (entries.length > 0) {
            const mostRecentEntry = entries[0];
            const today = new Date()
                .toISOString()
                .split("T")[0];

            const entryDate = new Date(mostRecentEntry.date)
                .toISOString()
                .split("T")[0];

            console.log("Today's date:", today);
            console.log("Most recent entry date:", entryDate);

            setHasSubmittedToday(today === entryDate);
            if (today === entryDate) {
                setEditableEntry({
                    rose: mostRecentEntry.rose_text,
                    bud: mostRecentEntry.bud_text,
                    thorn: mostRecentEntry.thorn_text
                });
            }
        }
    };

    const handleEditClick = () => {
        setIsEditing(!isEditing);
        if (isEditing) {
            // Reset to original values if canceling
            const mostRecentEntry = entries[0];
            setEditableEntry({
                rose: mostRecentEntry.rose_text,
                bud: mostRecentEntry.bud_text,
                thorn: mostRecentEntry.thorn_text
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableEntry((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.patch(
                `http://localhost:8000/entries/${entries[0]._id}`,
                editableEntry
            );

            if (response.status === 200) {
                const updatedEntry = response.data.entry;
                setEntries((prevEntries) => [
                    updatedEntry,
                    ...prevEntries.slice(1)
                ]);
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Error updating entry:", error);
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
    
    function handleSubmit(entry) {
        if (!userId) {
            console.error("No user ID available");
            return;
        }

        makePostCall(entry).then((result) => {
            if (result && result.status === 201) {
                setEntries([result.data, ...entries]);
                setHasSubmittedToday(true);
            }
        });
    }

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

    return (
        <div className="entry-page">
            {!hasSubmittedToday && (
                <h1 className="entry-header">Journal Entry</h1>
            )}
            {hasSubmittedToday ? (
                <div className="recent-entry">
                    <div className="entry-header">
                        <h2>Today's Entry</h2>
                        <button
                            className="edit-button"
                            onClick={handleEditClick}
                        >
                            {isEditing ? (
                                <>
                                    <FaTimes /> Cancel
                                </>
                            ) : (
                                <>
                                    <FaEdit /> Edit
                                </>
                            )}
                        </button>
                    </div>
                    <div className="entry-card">
                        {isEditing ? (
                            <>
                                <div className="entry-item">
                                    <h3>Rose</h3>
                                    <input
                                        type="text"
                                        name="rose"
                                        value={
                                            editableEntry.rose
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>
                                <div className="entry-item">
                                    <h3>Bud</h3>
                                    <input
                                        type="text"
                                        name="bud"
                                        value={
                                            editableEntry.bud
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>
                                <div className="entry-item">
                                    <h3>Thorn</h3>
                                    <input
                                        type="text"
                                        name="thorn"
                                        value={
                                            editableEntry.thorn
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />
                                </div>
                                <button
                                    className="update-button"
                                    onClick={handleUpdate}
                                >
                                    Update
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="entry-item">
                                    <h3>Rose</h3>
                                    <p>
                                        {entries[0].rose_text}
                                    </p>
                                </div>
                                <div className="entry-item">
                                    <h3>Bud</h3>
                                    <p>{entries[0].bud_text}</p>
                                </div>
                                <div className="entry-item">
                                    <h3>Thorn</h3>
                                    <p>
                                        {entries[0].thorn_text}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <NewEntry handleSubmit={handleSubmit} />
            )}
            {entries.length > 0 && !hasSubmittedToday && (
                <div className="recent-entry">
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
