/* 
IMPORTS
 */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { IoFolderOutline } from "react-icons/io5";
import {
    Title,
    PageContainer,
    TagFolder,
    Subtitle,
    TagContent,
    Folder,
    TagName,
    EntryNumber
} from "./search.styles";
import { entriesDB, tagsDB } from "../utils/db";

const API_BASE_URL = "http://rosebudthorn.azurewebsites.net";

// import styled from "styled-components";

// const SearchContainer = styled.div`
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100%;
// `;

// const SearchText = styled.h1`
//     font-size: 2rem;
//     color: #2c3e50;
// `;

// function SearchPage() {
//     return (
//         <SearchContainer>
//             <SearchText>Search Page</SearchText>
//         </SearchContainer>

function SearchPage({ userId }) {
    const [tags, setTags] = useState([]);
    const [theme, setTheme] = useState({ mode: "light-mode" });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        setTheme({ mode: currentTheme || "light-mode" });
    }, []);

    const fetchEntry = async (entryId) => {
        setIsLoading(true);

        try {
            const cachedEntry =
                await entriesDB.getById(entryId);

            if (cachedEntry) {
                return cachedEntry;
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/entries/${entryId}`,
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch entry");
                }

                const entry = await response.json();

                if (entry) {
                    await entriesDB.update({
                        ...entry,
                        user_id: userId
                    });
                }

                return entry;
            } catch (networkError) {
                console.error(
                    "Network entry request failed, using cached data:",
                    networkError
                );
            }
        } catch (error) {
            console.error(
                "Error fetching entry by entryid:",
                error
            );
        }

        setIsLoading(false);
    };

    // fetch user's tags
    const fetchTags = async () => {
        setIsLoading(true);

        try {
            const cachedTags = await tagsDB.getAll(userId);

            if (cachedTags && cachedTags.length > 0) {
                setTags(cachedTags);
            }

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/entries/tags/${userId}`,
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.message || "Failed to fetch tags"
                    );
                }

                // set tags with entries data
                const tags = await response.json();

                if (tags) {
                    console.log("User's tags fetched:", tags);
                    setTags(tags);

                    // Update each tag individually in IndexedDB
                    for (const tag of tags) {
                        await tagsDB.update({
                            ...tag,
                            user_id: userId
                        });
                    }
                }
            } catch (networkError) {
                console.error(
                    "Network tags request failed, using cached data:",
                    networkError
                );
            }
        } catch (error) {
            console.error("Error loading tags:", error);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // navigates to the tag's folder and passes in tag id and entries
    const navigateToTag = async (tag) => {
        const entryObjects = [];
        for (let i = 0; i < tag.entries.length; i++) {
            let currentEntry = await fetchEntry(tag.entries[i]);
            entryObjects.push(currentEntry);
        }

        navigate(
            `/search/${tag._id}/${encodeURIComponent(
                tag.tag_name
            )}`,
            {
                state: {
                    tag_name: tag.tag_name,
                    entries: entryObjects
                }
            }
        );
    };

    if (isLoading) {
        return <div> </div>;
    } else {
        return (
            <ThemeProvider theme={theme}>
                <PageContainer>
                    {/* no tags view */}
                    {tags.length === 0 ? (
                        <>
                            <Title>No Tags Yet!</Title>
                        </>
                    ) : (
                        // display tags
                        <>
                            <Subtitle>Your Tags</Subtitle>
                            {tags.map((tag) => (
                                <TagFolder
                                    key={tag._id}
                                    onClick={() =>
                                        navigateToTag(tag)
                                    }
                                >
                                    <Folder>
                                        <IoFolderOutline />
                                    </Folder>
                                    <TagContent>
                                        <TagName>
                                            {tag.tag_name}
                                        </TagName>
                                        <EntryNumber>
                                            {tag.entries.length}{" "}
                                            {tag.entries
                                                .length === 1
                                                ? "entry"
                                                : "entries"}
                                        </EntryNumber>
                                    </TagContent>
                                </TagFolder>
                            ))}
                        </>
                    )}
                </PageContainer>
            </ThemeProvider>
        );
    }
}

export default SearchPage;
