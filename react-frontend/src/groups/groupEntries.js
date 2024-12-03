/*
IMPORTS
*/
import React, { useState, useEffect } from "react";
import axios from "axios";
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
    EntryDate,
    EntryReactions,
    Reaction,
    ReactionCount
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
    const [reactionCounts, setReactionCounts] = useState({});

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
                                    date: data.currentEntry
                                        .date,
                                    id: data.currentEntry._id
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

    // add new reaction
    const newReaction = async (emoji, user, entry) => {
        let exists = false;

        if (reactionCounts[user][emoji] !== 0) {
            exists = true;
        }

        if (
            user !== localStorage.getItem("userId") &&
            !exists
        ) {
            // make reaction object
            const reactionData = {
                entry_id: entry,
                user_id: user,
                group_id: groupId,
                reaction_string: emoji
            };

            console.log(reactionData);

            try {
                // post new reaction
                const response = await axios.put(
                    `http://localhost:8000/entries/reaction`,
                    reactionData
                );

                if (response && response.status === 201) {
                    console.log(
                        "Reaction recorded: ",
                        response.data
                    );

                    setReactionCounts((prev) => {
                        const updated = { ...prev };
                        if (!updated[user]) {
                            updated[user] = {
                                thumb: 0,
                                heart: 0,
                                smile: 0,
                                laugh: 0,
                                cry: 0
                            };
                        }
                        updated[user][emoji] += 1;

                        console.log(updated);
                        return updated;
                    });
                } else {
                    console.log(
                        "Reaction response posting not ok: ",
                        response
                    );
                    return null;
                }
            } catch (err) {
                console.error("Error saving reaction: ", err);
            }
        }
    };

    // fetch reaction counts for entries
    useEffect(() => {
        const fetchReactions = async () => {
            try {
                if (!Array.isArray(groupUsers)) {
                    console.error(
                        "groupUsers is not an array:",
                        groupUsers
                    );
                    return;
                }

                const reactionData = await Promise.all(
                    groupUsers.map(async (user) => {
                        try {
                            const resp = await fetch(
                                // get most recent entry for each user
                                `http://localhost:8000/users/${user}/recent`
                            );

                            if (!resp.ok) {
                                throw new Error(
                                    `HTTP error! status: ${resp.status}`
                                );
                            }

                            const data = await resp.json();

                            if (
                                data.currentEntry &&
                                Array.isArray(
                                    data.currentEntry.reactions
                                )
                            ) {
                                // extract reactions
                                const reacts =
                                    data.currentEntry.reactions;
                                console.log(reacts);

                                // initialize to 0
                                const counts = {
                                    thumb: 0,
                                    heart: 0,
                                    smile: 0,
                                    laugh: 0,
                                    cry: 0
                                };

                                // count each reaction number
                                reacts.forEach((rxn) => {
                                    console.log(rxn.reaction);
                                    if (
                                        rxn.reaction === "thumb"
                                    )
                                        counts.thumb += 1;
                                    if (
                                        rxn.reaction === "heart"
                                    )
                                        counts.heart += 1;
                                    if (
                                        rxn.reaction === "smile"
                                    )
                                        counts.smile += 1;
                                    if (
                                        rxn.reaction === "laugh"
                                    )
                                        counts.laugh += 1;
                                    if (rxn.reaction === "cry")
                                        counts.cry += 1;
                                });

                                console.log(counts);

                                return {
                                    userId: user,
                                    counts
                                };
                            }

                            return null;
                        } catch (err) {
                            console.error(
                                `Failed to fetch reactions for user ${user}:`,
                                err
                            );
                            return null;
                        }
                    })
                );

                const validReactionData = reactionData.filter(
                    (rxns) => rxns !== null
                );

                setReactionCounts((prev) => {
                    const updated = { ...prev };

                    validReactionData.forEach((data) => {
                        updated[data.userId] = data.counts;
                    });

                    return updated;
                });
            } catch (err) {
                console.error("Error fetching reactions:", err);
            }
        };

        if (
            entries.length > 0 &&
            groupUsers &&
            groupUsers.length > 0
        ) {
            fetchReactions();
        }
        // fetch numbers on change of:
    }, [entries, groupUsers]);

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
                                <EntryReactions>
                                    {[
                                        "thumb",
                                        "heart",
                                        "smile",
                                        "laugh",
                                        "cry"
                                    ].map((emoji) => (
                                        <Reaction
                                            key={emoji}
                                            onClick={() =>
                                                // send emoji and entry reaction is for
                                                newReaction(
                                                    emoji,
                                                    entry.userId,
                                                    entry.id
                                                )
                                            }
                                        >
                                            {/* render emojis */}
                                            {emoji ===
                                                "thumb" && "👍"}
                                            {emoji ===
                                                "heart" && "❤️"}
                                            {emoji ===
                                                "smile" && "🙂"}
                                            {emoji ===
                                                "laugh" && "😂"}
                                            {emoji === "cry" &&
                                                "😭"}
                                            <ReactionCount>
                                                {reactionCounts[
                                                    entry.userId
                                                ]?.[emoji] || 0}
                                            </ReactionCount>
                                        </Reaction>
                                    ))}
                                </EntryReactions>
                            </EntryCard>
                        ))}
                    </EntriesContainer>
                </ContentContainer>
            </Container>
        </ThemeProvider>
    );
}

export default GroupEntries;
