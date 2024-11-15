/*
IMPORTS
*/
import React, { useState, useEffect } from "react";
import {
    useParams,
    useNavigate,
    useLocation
} from "react-router-dom";
import {
    FiCopy,
    FiShare,
    FiHash,
    FiChevronLeft
} from "react-icons/fi";
import { ThemeProvider } from "styled-components";

// Styles
import {
    Container,
    ContentContainer,
    EntryPageTitle,
    CodeButton,
    GroupCodeDisplay,
    ActionIcon,
    Toast,
    HeaderRow,
    BackButton,
    HeaderContainer,
    getGradient,
    EntriesContainer,
    EntryCard,
    EntryName,
    EntrySection,
    EntryText,
    EntryHeader,
    EntryDate
} from "./group.styles";

/*
RENDER
*/
function GroupEntries() {
    // Constants & states
    const { groupId, groupName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const groupCode = location.state?.group_code;
    const groupUsers = location.state?.users;
    const [showToast, setShowToast] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [entries, setEntries] = useState([]);
    const [theme, setTheme] = useState({ mode: "light-mode" });

    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        setTheme({ mode: currentTheme || "light-mode" });
    }, []);

    // Get gradient for the group
    const gradient = getGradient(groupId);

    // Function for copying group code
    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        setShowToast(true);
    };

    // Function to get date display
    const getDateDisplay = (dateString) => {
        const entryDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - entryDate);
        const diffDays = Math.floor(
            diffTime / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
            return { text: "Today", emoji: "😊" };
        } else if (diffDays === 1) {
            return { text: "Yesterday", emoji: "🙂" };
        } else if (diffDays <= 7) {
            return {
                text: `${diffDays} days ago`,
                emoji: "😕"
            };
        } else {
            return {
                text: entryDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric"
                }),
                emoji: "😢"
            };
        }
    };

    // Fetch entries for the group
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                if (!Array.isArray(groupUsers)) {
                    console.error(
                        "groupUsers is not an array:",
                        groupUsers
                    );
                    return;
                }

                // Fetch entries for each user in the group
                const recentEntries = await Promise.all(
                    groupUsers.map(async (user) => {
                        try {
                            const response = await fetch(
                                `http://localhost:8000/users/${user}/recent`
                            );

                            if (!response.ok) {
                                throw new Error(
                                    `HTTP error! status: ${response.status}`
                                );
                            }

                            const data = await response.json();

                            // If there's a currentEntry, return the processed entry
                            if (data.currentEntry) {
                                return {
                                    userId: user,
                                    userName: data.userName,
                                    rose_text:
                                        data.currentEntry
                                            .rose_text,
                                    bud_text:
                                        data.currentEntry
                                            .bud_text,
                                    thorn_text:
                                        data.currentEntry
                                            .thorn_text,
                                    date: data.currentEntry.date
                                };
                            }

                            // If no entries or no public entries, return null
                            return null;
                        } catch (err) {
                            console.error(
                                `Failed to fetch for user ${user}:`,
                                err
                            );
                            return null;
                        }
                    })
                );

                // Filter out null entries (users with no entries or no public entries)
                const validEntries = recentEntries.filter(
                    (entry) => entry !== null
                );
                setEntries(validEntries);
            } catch (error) {
                console.error("Error in fetchEntries:", error);
            }
        };

        if (groupUsers && groupUsers.length > 0) {
            fetchEntries();
        }
    }, [groupUsers]);

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <ContentContainer>
                    {/* Header */}
                    <HeaderContainer>
                        <HeaderRow>
                            <BackButton
                                onClick={() =>
                                    navigate("/groups")
                                }
                            >
                                <FiChevronLeft />
                            </BackButton>
                            <EntryPageTitle gradient={gradient}>
                                {decodeURIComponent(groupName)}
                            </EntryPageTitle>
                            <CodeButton
                                onClick={() =>
                                    setShowCode(!showCode)
                                }
                            >
                                <FiHash />
                            </CodeButton>
                        </HeaderRow>
                    </HeaderContainer>

                    {/* Group code display */}
                    <GroupCodeDisplay isVisible={showCode}>
                        <span className="code">
                            {groupCode}
                        </span>
                        <ActionIcon onClick={handleCopyCode}>
                            <FiCopy />
                        </ActionIcon>
                        <ActionIcon>
                            <FiShare />
                        </ActionIcon>
                    </GroupCodeDisplay>

                    {/* Toast for copying code */}
                    {showToast && (
                        <Toast
                            onAnimationEnd={() =>
                                setShowToast(false)
                            }
                        >
                            Code copied to clipboard!
                        </Toast>
                    )}

                    {/* Map through the entries */}
                    <EntriesContainer>
                        {entries.map((entry) => (
                            <EntryCard key={entry.userId}>
                                <EntryHeader>
                                    <EntryName>
                                        {entry.userName}
                                    </EntryName>
                                    <EntryDate>
                                        {
                                            getDateDisplay(
                                                entry.date
                                            ).text
                                        }
                                        <span>
                                            {
                                                getDateDisplay(
                                                    entry.date
                                                ).emoji
                                            }
                                        </span>
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
                        ))}
                    </EntriesContainer>
                </ContentContainer>
            </Container>
        </ThemeProvider>
    );
}

export default GroupEntries;
