/* UPDATES NEEDED WITHIN CREATEGROUP & JOINGROUP */
/* IMPLEMENTATION OF GROUP ENTRIES IS FAKE */

/* 
IMPORTS
 */

// Libraries
import React, { useState, useEffect } from "react";
import { IoChevronForward } from "react-icons/io5";
import { ChevronIcon } from "./group.styles";
import { useNavigate } from "react-router-dom";

// Data (DRAWS MOCK DATA RN)
import mockData from "./mockGroups.json";

// Styles
import {
    PageContainer,
    Title,
    Subtitle,
    GroupCard,
    getGradient,
    GroupCardContent
} from "./group.styles";

// Components
import CreateGroup from "./CreateGroup";
import JoinGroup from "./JoinGroup";

/*
RENDER
*/
function GroupsPage() {
    const [userGroups, setUserGroups] = useState([]);
    const navigate = useNavigate();

    /* TAGGED FOR UPDATE */
    useEffect(() => {
        // !!! Later: Replace with database call
        const fetchGroups = () => {
            const currentUserId = mockData.currentUserId;
            const userGroups = mockData.groups.filter((group) =>
                group.members.includes(currentUserId)
            );
            setUserGroups(userGroups);
        };

        fetchGroups();
    }, []);

    // Navigates to the group's entries page
    const handleGroupClick = (group) => {
        navigate(
            `/groups/${group._id}/${encodeURIComponent(
                group.name
            )}`
        );
    };

    // Shown if the user is not in any groups
    const NoGroupsView = () => (
        <>
            <Title>Share the experience!</Title>
            <CreateGroup />
            <JoinGroup />
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
            <CreateGroup />
            <JoinGroup />
        </>
    );

    // Render the page based on # of groups
    return (
        <PageContainer>
            {userGroups.length === 0 ? (
                <NoGroupsView />
            ) : (
                <GroupsView />
            )}
        </PageContainer>
    );
}

// Used in index.js
export default GroupsPage;
