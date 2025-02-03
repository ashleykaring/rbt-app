import React, { useState, useEffect } from "react";
import { FaTimes, FaEye, FaLock } from "react-icons/fa";
import { ThemeProvider } from "styled-components";
import {
    EntryContainer,
    EntryTitle,
    EntryField,
    EntryInput,
    EntryText,
    TagsSection,
    TagsContainer,
    TagPill,
    ErrorMessage,
    FieldLabel,
    SubmitContainer,
    VisibilityToggle,
    ToggleOption,
    SubmitWrapper,
    SubmitText
} from "./Entry.styles";
import { entriesDB } from "../utils/db";
import styled from "styled-components";

const theme = {
    lightPink: "rgba(242, 196, 187, 0.5)" // Lighter version of fill-color
};

const NewEntryPage = ({ userId }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    // State for entry data
    const [entry, setEntry] = useState({
        rose: "",
        bud: "",
        thorn: ""
    });

    // State for UI
    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [editingField, setEditingField] = useState(null);
    const [error, setError] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);

    // Fetch today's entry on mount
    useEffect(() => {
        loadTodaysEntry();
    }, []);

    const loadTodaysEntry = async () => {
        setIsLoading(true);
        try {
            // First try IndexedDB
            const cachedEntry = await entriesDB.getTodaysEntry(
                userId
            );
            if (cachedEntry) {
                updateUIFromEntry(cachedEntry);
            }

            // Then fetch from API - get all entries and find today's
            try {
                const response = await fetch(
                    "http://localhost:8000/api/entries",
                    {
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    const entries = await response.json();
                    // Find today's entry if it exists
                    const today = new Date();
                    const todaysEntry = entries.find(
                        (entry) => {
                            const entryDate = new Date(
                                entry.date
                            );
                            return (
                                entryDate.getDate() ===
                                    today.getDate() &&
                                entryDate.getMonth() ===
                                    today.getMonth() &&
                                entryDate.getFullYear() ===
                                    today.getFullYear()
                            );
                        }
                    );

                    if (todaysEntry) {
                        updateUIFromEntry(todaysEntry);
                        // Update IndexedDB with latest data
                        await entriesDB.update({
                            ...todaysEntry,
                            user_id: userId
                        });
                    }
                }
            } catch (networkError) {
                console.log(
                    "Network request failed, using cached data"
                );
            }
        } catch (error) {
            console.error("Error loading entry:", error);
        }
        setIsLoading(false);
    };

    // Helper to update UI state from entry data
    const updateUIFromEntry = (entryData) => {
        setEntry({
            rose: entryData.rose_text,
            bud: entryData.bud_text,
            thorn: entryData.thorn_text,
            _id: entryData._id
        });
        // Use tags array directly if available, otherwise parse tag_string
        const tagArray = Array.isArray(entryData.tags)
            ? entryData.tags
            : entryData.tag_string
            ? entryData.tag_string
                  .split(", ")
                  .filter((tag) => tag)
            : [];
        setTags(tagArray);
        setIsPublic(entryData.is_public);
        setIsEditMode(true);
        setHasChanges(false);
    };

    // Tag handling
    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const tag = currentTag.trim();
            if (tag && !tags.includes(tag)) {
                setTags([...tags, tag]);
                setCurrentTag("");
                setHasChanges(true);
            }
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
        setHasChanges(true);
    };

    // Field editing
    const handleFieldClick = (field) => {
        setEditingField(field);
    };

    const handleFieldChange = (field, value) => {
        setHasChanges(true);
        setEntry((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFieldBlur = () => {
        setEditingField(null);
    };

    // Submit handling
    const handleSubmit = async () => {
        if (!entry.rose || !entry.bud || !entry.thorn) {
            setError("Please fill in all fields");
            return;
        }

        // Create tag string from array
        const tag_string = tags.join(", ");

        const entryData = {
            rose_text: entry.rose,
            bud_text: entry.bud,
            thorn_text: entry.thorn,
            tags: tags,
            tag_string: tag_string,
            is_public: isPublic
        };

        try {
            if (isEditMode) {
                // Update existing entry
                await entriesDB.update({
                    ...entryData,
                    _id: entry._id
                });
                const response = await fetch(
                    `http://localhost:8000/api/entries/${entry._id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify(entryData)
                    }
                );
                if (!response.ok)
                    throw new Error("Failed to update entry");
                const data = await response.json();
                updateUIFromEntry(data.entry);
            } else {
                // Create new entry
                const response = await fetch(
                    "http://localhost:8000/api/entries",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body: JSON.stringify(entryData)
                    }
                );

                if (!response.ok)
                    throw new Error("Failed to create entry");

                const data = await response.json();
                // Update IndexedDB after successful API call
                await entriesDB.add({
                    ...data,
                    user_id: userId
                });

                // After successful creation, load today's entry fresh
                await loadTodaysEntry();
            }
        } catch (error) {
            console.error("Error saving entry:", error);
            setError("Failed to save entry");
        }
    };

    if (isLoading) {
        return <div></div>;
    }

    return (
        <ThemeProvider theme={theme}>
            <EntryContainer>
                <EntryTitle>
                    {isEditMode
                        ? "Edit Today's Entry"
                        : "Add Today's Entry"}
                </EntryTitle>

                {["rose", "bud", "thorn"].map((field) => (
                    <EntryField key={field}>
                        <FieldLabel>{field}</FieldLabel>
                        {isEditMode && !editingField ? (
                            <EntryText
                                onClick={() =>
                                    handleFieldClick(field)
                                }
                            >
                                {entry[field] ||
                                    `Click to edit your ${field}`}
                            </EntryText>
                        ) : (
                            <EntryInput
                                value={entry[field]}
                                onChange={(e) =>
                                    handleFieldChange(
                                        field,
                                        e.target.value
                                    )
                                }
                                onBlur={
                                    isEditMode
                                        ? handleFieldBlur
                                        : undefined
                                }
                                placeholder={`What's your ${field} for today?`}
                                autoFocus={
                                    editingField === field
                                }
                            />
                        )}
                    </EntryField>
                ))}

                <EntryField>
                    <FieldLabel>Tags</FieldLabel>
                    <EntryInput
                        value={currentTag}
                        onChange={(e) =>
                            setCurrentTag(e.target.value)
                        }
                        onKeyDown={handleTagKeyDown}
                        placeholder="Add tags (separate with commas)"
                    />
                    <TagsSection>
                        <TagsContainer>
                            {tags.map((tag) => (
                                <TagPill key={tag}>
                                    {tag}
                                    <button
                                        onClick={() =>
                                            removeTag(tag)
                                        }
                                    >
                                        <FaTimes />
                                    </button>
                                </TagPill>
                            ))}
                        </TagsContainer>
                    </TagsSection>
                </EntryField>

                <SubmitContainer>
                    <SubmitWrapper
                        onClick={handleSubmit}
                        isEditMode={isEditMode}
                        hasChanges={hasChanges}
                    >
                        <SubmitText>
                            {isEditMode
                                ? "Save Changes"
                                : "Submit Entry"}
                        </SubmitText>
                        <VisibilityToggle
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ToggleOption
                                selected={isPublic}
                                onClick={() =>
                                    setIsPublic(true)
                                }
                            >
                                <FaEye />
                                <span>Public</span>
                            </ToggleOption>
                            <ToggleOption
                                selected={!isPublic}
                                onClick={() =>
                                    setIsPublic(false)
                                }
                            >
                                <FaLock />
                                <span>Private</span>
                            </ToggleOption>
                        </VisibilityToggle>
                    </SubmitWrapper>
                </SubmitContainer>

                {error && <ErrorMessage>{error}</ErrorMessage>}
            </EntryContainer>
        </ThemeProvider>
    );
};

export default NewEntryPage;
