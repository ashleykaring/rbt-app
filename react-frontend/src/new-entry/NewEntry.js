import React, { useState } from "react";
import "./Entry.css";

function NewEntry(props) {
    const [entry, setEntry] = useState({
        rose: "",
        bud: "",
        thorn: "",
        tag_string: "",
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
        // filter the tags before submission
        // let tagsArray = [];
        // if (entry.tag_string && entry.tag_string.length > 0) {
        //     // split by commas
        //     tagsArray = entry.tag_string.trim().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        // }

        const taggedEntry = {
            ...entry,
            tags: entry.tag_string // still include if empty
        };

        console.log("Submitting entry:", taggedEntry);
        if (taggedEntry.rose && taggedEntry.bud && taggedEntry.thorn) {
            props.handleSubmit(taggedEntry);
        } else {
            setErrorMessage("Please fill in all fields");
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
            <label htmlFor="tag_string">Tags</label>
            <input
                type="text"
                name="tag_string"
                id="tag_string"
                placeholder="Add tags (separated by commas)"
                value={entry.tag_string}
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
