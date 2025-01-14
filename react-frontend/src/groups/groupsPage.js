/* 
IMPORTS
 */
import React, { useState, useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { IoChevronForward } from "react-icons/io5";

// Styles
import {
    PageContainer,
    Title,
    Subtitle,
    GroupCard,
    getGradient,
    GroupCardContent,
    ChevronIcon,
    LoadingContainer,
    LoadingSpinner,
    LoadingText
} from "./group.styles";

// Components
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";

const API_BASE_URL = "http://localhost:8000";

/*
RENDER
*/
function GroupsPage() {
    const [userGroups, setUserGroups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [theme, setTheme] = useState({ mode: "light-mode" });

    // Set the theme
    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        setTheme({ mode: currentTheme || "light-mode" });
    }, []);

    // Fetch groups for the user
    const fetchGroups = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `${API_BASE_URL}/api/groups`,
                {
                    credentials: "include" // Important for sending cookies
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(
                    data.message || "Failed to fetch groups"
                );
            }

            const groups = await response.json();
            console.log("Fetched groups:", groups);
            setUserGroups(groups);
        } catch (err) {
            console.error("Error fetching groups:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Navigates to the group's entries page
    const handleGroupClick = (group) => {
        navigate(
            `/groups/${group._id}/${encodeURIComponent(
                group.name
            )}`,
            {
                state: {
                    group_code: group.group_code,
                    users: group.users
                }
            }
        );
    };

    // Shown if the user is not in any groups
    const NoGroupsView = () => (
        <>
            <Subtitle>Join a Group!</Subtitle>
            <CreateGroup onGroupUpdate={fetchGroups} />
            <JoinGroup onGroupUpdate={fetchGroups} />
        </>
    );

    // Shown if the user is in at least one group
    const GroupsView = () => (
        <>
            <Subtitle>Your Groups</Subtitle>
            {userGroups.map((group) => (
                <GroupCard
                    key={group._id}
                    gradient={getGradient(group._id)}
                    onClick={() => handleGroupClick(group)}
                >
                    <GroupCardContent>
                        <h3>{group.name}</h3>
                        <ChevronIcon>
                            <IoChevronForward />
                        </ChevronIcon>
                    </GroupCardContent>
                </GroupCard>
            ))}
            <Subtitle>Expand Your Groups</Subtitle>
            <CreateGroup onGroupUpdate={fetchGroups} />
            <JoinGroup onGroupUpdate={fetchGroups} />
        </>
    );

    // Loading spinner
    if (isLoading) {
        return (
            <LoadingContainer>
                <LoadingSpinner>
                    <BiLoaderAlt />
                </LoadingSpinner>
                <LoadingText>
                    Getting your groups...
                </LoadingText>
            </LoadingContainer>
        );
    }

    // Fall back if there's an error
    if (error) {
        return <PageContainer>Error: {error}</PageContainer>;
    }

    // Render the page based on # of groups
    return (
        <ThemeProvider theme={theme}>
            <PageContainer>
                {userGroups.length === 0 ? (
                    <NoGroupsView />
                ) : (
                    <GroupsView />
                )}
            </PageContainer>
        </ThemeProvider>
    );
}

export default GroupsPage;
