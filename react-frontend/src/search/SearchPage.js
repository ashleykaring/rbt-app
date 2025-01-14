/* 
IMPORTS
 */
import React, { useState, useEffect } from "react";
import { getCurrentUserId } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { CiFolderOn } from "react-icons/ci";
import { MdFolderOpen } from "react-icons/md";
import { IoFolderOutline } from "react-icons/io5";

import {
    Title,
    PageContainer,
    TagFolder,
    Subtitle,
    TagContent,
    Folder,
    TagName
} from "./search.styles";

const API_BASE_URL = "http://localhost:8000";

function SearchPage() {
    const [tags, setTags] = useState([]);
    const [theme, setTheme] = useState({ mode: "light-mode" });
    const navigate = useNavigate();

    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        setTheme({ mode: currentTheme || "light-mode" });
    }, []);

    // fetch user's tags
    const fetchTags = async () => {
        try {
            const userId = await getCurrentUserId();

            const response = await fetch(
                `${API_BASE_URL}/api/entries/tags/${userId}`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to fetch tags");
            }

            // set tags with entries data
            const tags = await response.json();
            console.log("User's tags fetched:", tags);
            setTags(tags);

        } catch (err) {
            console.error("Error fetching tags:", err);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    // navigates to the tag's folder and passes in tag id and entries
    const navigateToTag = (tag) => {
        navigate(
            `/search/${tag._id}/${encodeURIComponent(tag.tag_name)}`,
            {
                state: {
                    tag_id: tag._id,
                    entries: tag.entries
                }
            }
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <PageContainer>
                {/* no tags view */}
                {tags.length === 0 ? (
                    <>
                        <Title>No Tags Yet!</Title>
                        <TagFolder>
                            <Folder>
                                <IoFolderOutline />
                            </Folder>
                            <TagContent>
                                <TagName>
                                    Example
                                </TagName>
                            </TagContent>
                        </TagFolder>
                    </>
                ) : (
                    // display tags
                    <>
                        <Subtitle>Your Tags</Subtitle>
                        {tags.map((tag) => (
                            <TagFolder
                                key={tag._id}
                                onClick={() => navigateToTag(tag)}
                            >
                                <Folder>
                                    <IoFolderOutline />
                                </Folder>
                                <TagContent>
                                    <TagName>
                                        {tag.tag_name}
                                    </TagName>
                                    {/* ADD NUMBER OF ENTRIES HERE */}
                                </TagContent>
                            </TagFolder>
                        ))}
                    </>
                )}
            </PageContainer>
        </ThemeProvider>
    );
}

export default SearchPage;
