import React, { useState, useEffect, useCallback } from "react";
import NewEntry from "./NewEntry";
import axios from "axios";
import "./Entry.css";
import { FaEdit, FaTimes } from "react-icons/fa";

function EntryPage() {
    const [entries, setEntries] = useState([]);
    const [hasSubmittedToday, setHasSubmittedToday] =
        useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editableEntry, setEditableEntry] = useState({
        rose: "",
        bud: "",
        thorn: "",
        isPublic: true
    });

    const fetchUserEntries = useCallback(async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/entries",
                {
                    credentials: "include" // For JWT cookie
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch entries");
            }

            const data = await response.json();
            console.log("Fetched entries:", data);
            setEntries(data);
            checkIfSubmittedToday(data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    }, []);

    useEffect(() => {
        fetchUserEntries();
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
                    thorn: mostRecentEntry.thorn_text,
                    isPublic: mostRecentEntry.is_public
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
                thorn: mostRecentEntry.thorn_text,
                isPublic: mostRecentEntry.is_public
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
            const updateData = {
                rose_text: editableEntry.rose,
                bud_text: editableEntry.bud,
                thorn_text: editableEntry.thorn,
                is_public: editableEntry.isPublic
            };

            const response = await fetch(
                `http://localhost:8000/api/entries/${entries[0]._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(updateData)
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update entry");
            }

            const data = await response.json();
            setEntries((prevEntries) => [
                data.entry,
                ...prevEntries.slice(1)
            ]);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating entry:", error);
        }
    };

    function handleSubmit(entry) {
        makePostCall(entry).then((result) => {
            if (result && result.status === 201) {
                setEntries([result.data, ...entries]);
                setHasSubmittedToday(true);
            }
        });
    }

    async function makePostCall(entry) {
        try {
            const response = await fetch(
                "http://localhost:8000/api/entries",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        rose_text: entry.rose,
                        bud_text: entry.bud,
                        thorn_text: entry.thorn,
                        is_public: entry.isPublic
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create entry");
            }

            const data = await response.json();
            return { status: 201, data };
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
                                <div className="toggle-container">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={
                                                editableEntry.isPublic
                                            }
                                            onChange={(e) =>
                                                setEditableEntry(
                                                    (prev) => ({
                                                        ...prev,
                                                        isPublic:
                                                            e
                                                                .target
                                                                .checked
                                                    })
                                                )
                                            }
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                    <span className="toggle-label">
                                        {editableEntry.isPublic
                                            ? "Public Entry"
                                            : "Private Entry"}
                                    </span>
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
                    <div className="entry-card">
                        <div className="entry-item">
                            <h3>Rose</h3>
                            <p>{entries[0].rose_text}</p>
                        </div>
                        <div className="entry-item">
                            <h3>Bud</h3>
                            <p>{entries[0].bud_text}</p>
                        </div>
                        <div className="entry-item">
                            <h3>Thorn</h3>
                            <p>{entries[0].thorn_text}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EntryPage;
