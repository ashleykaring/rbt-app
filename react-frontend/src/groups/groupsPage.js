/* 
IMPORTS
 */
import React, { useState, useEffect } from "react";
import { IoChevronForward } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";

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

    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        setTheme({ mode: currentTheme || "light-mode" });
    }, []);

    const fetchGroups = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                throw new Error("User not logged in");
            }

            const response = await fetch(
                `${API_BASE_URL}/users/${userId}/groups`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch groups");
            }

            const groups = await response.json();
            console.log(
                "Fetched groups with codes:",
                groups.map((g) => ({
                    id: g._id,
                    name: g.name,
                    code: g.group_code
                }))
            );
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
            <Title>Join a Group!</Title>
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
