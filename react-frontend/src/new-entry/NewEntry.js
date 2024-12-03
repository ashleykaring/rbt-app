import React, { useState } from "react";
import "./Entry.css";

function NewEntry(props) {
    const [entry, setEntry] = useState({
        rose: "",
        bud: "",
        thorn: "",
        isPublic: true
    });
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;
        setEntry((prevEntry) => ({
            ...prevEntry,
            [name]: value
        }));
        if (errorMessage) setErrorMessage("");
    }

    function submitEntry() {
        if (entry.rose && entry.bud && entry.thorn) {
            makePostCall(entry);
        } else {
            setErrorMessage("Please fill in all fields");
        }
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
            props.handleSubmit(data);
            return { status: 201, data };
        } catch (error) {
            console.error("Error creating entry:", error);
            return false;
        }
    }

    return (
        <form>
            <label htmlFor="rose">Rose</label>
            <input
                type="text"
                name="rose"
                id="rose"
                placeholder="What went well today?"
                value={entry.rose}
                onChange={handleChange}
            />
            <label htmlFor="bud">Bud</label>
            <input
                type="text"
                name="bud"
                id="bud"
                placeholder="Any areas for growth?"
                value={entry.bud}
                onChange={handleChange}
            />
            <label htmlFor="thorn">Thorn</label>
            <input
                type="text"
                name="thorn"
                id="thorn"
                placeholder="What could have been better?"
                value={entry.thorn}
                onChange={handleChange}
            />
            <div className="toggle-container">
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={entry.isPublic}
                        onChange={(e) =>
                            setEntry((prev) => ({
                                ...prev,
                                isPublic: e.target.checked
                            }))
                        }
                    />
                    <span className="toggle-slider"></span>
                </label>
                <span className="toggle-label">
                    {entry.isPublic
                        ? "Public Entry"
                        : "Private Entry"}
                </span>
            </div>
            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}
            <input
                type="button"
                value="Submit Entry"
                onClick={submitEntry}
            />
        </form>
    );
}

export default NewEntry;
