import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { FiChevronLeft } from "react-icons/fi";
import {
    ContentContainer,
    Container,
    HeaderContainer,
    HeaderRow,
    BackButton,
    EntriesContainer,
    EntryCard,
    EntryHeader,
    EntrySection,
    EntryDate,
    EntryText,
    EntryPageTitle
} from "./search.styles"

const API_BASE_URL = "http://localhost:8000";

function TagEntries() {
    const navigate = useNavigate();
    // to access the state
    const location = useLocation();
    // use location.state or none if no entries
    const tagId = location.state.tag_id;
    const tagEntries = location.state.entries;
    console.log(tagEntries);
    const tagName = location.state.tag_name;
    const [theme, setTheme] = useState({ mode: "light-mode" });

    // set theme
    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        setTheme({ mode: currentTheme || "light-mode" });
    }, []);

    const getDate = (dateString) => {
        const entryDate = new Date(dateString);
        return {
            text: entryDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            })
        };
    }

    const fetchEntry = async (entryId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/entries/${entryId}`,
                {
                    credentials: "include" // For JWT cookie
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch entry");
            }

            const entry = await response.json();
            return entry;
        } catch (error) {
            console.error("Error in fetchEntry:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            {!tagEntries ? (
                <p>No entries found</p>
            ) : (
                <Container>
                    <ContentContainer>
                        <HeaderContainer>
                            <HeaderRow>
                                <BackButton
                                    onClick={() =>
                                        navigate("/search")
                                    }
                                >
                                    <FiChevronLeft />
                                </BackButton>
                                <EntryPageTitle>
                                    Entries for {tagName}
                                </EntryPageTitle>
                            </HeaderRow>
                        </HeaderContainer>

                        {/* display all entries in the tag */}
                        <EntriesContainer>
                            {tagEntries.map((entryId) => {
                                const entry = fetchEntry(entryId);

                                return (
                                    <EntryCard key={entry._id}>
                                        <EntryHeader>
                                            <EntryDate>
                                                {
                                                    getDate(
                                                        entry.date
                                                    ).text
                                                }
                                            </EntryDate>
                                        </EntryHeader>
                                        <EntrySection type="rose">
                                            <EntryText>
                                                {entry.rose_text}
                                            </EntryText>
                                        </EntrySection>
                                        <EntrySection type="bud">
                                            <EntryText>
                                                {entry.bud_text}
                                            </EntryText>
                                        </EntrySection>
                                        <EntrySection type="thorn">
                                            <EntryText>
                                                {entry.thorn_text}
                                            </EntryText>
                                        </EntrySection>
                                    </EntryCard>
                                )
                            }
                            )}
                        </EntriesContainer>
                    </ContentContainer>
                </Container>
            )}
        </ThemeProvider>
    );
}

export default TagEntries;
