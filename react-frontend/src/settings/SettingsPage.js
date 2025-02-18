/*
IMPORTS
*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaMoon,
    FaSun,
    FaSignOutAlt,
    FaSync,
    FaSignOutAlt as FaLeaveGroup
} from "react-icons/fa";
import * as S from "./SettingsStyles";
import { createGlobalStyle } from "styled-components"; 
import { userDB, groupsDB, clearDB } from "../utils/db";  


export const GlobalStyle = createGlobalStyle`
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

function Settings({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [theme, setTheme] = useState("light-mode");

    // Track both current and edited values
    const [currentUser, setCurrentUser] = useState({
        name: "",
        email: ""
    });
    const [editedUser, setEditedUser] = useState({
        name: "",
        email: ""
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [saveStatus, setSaveStatus] = useState("");
    const [groups, setGroups] = useState([]);
    const [groupsError, setGroupsError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Fetch user details from indexedDB on mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                //checks incexedDB (cached data)
                const cachedUser = await userDB.get("current_user");
                if (cachedUser) {
                    setCurrentUser(cachedUser);
                    setEditedUser(cachedUser);
                    setIsLoading(false);
                }
                //fetch latest data from api (always)
                const response = await fetch(
                    "http://localhost:8000/api/user/details", { 
                        credentials: "include"
                    }
                );

                if (!response.ok)
                    throw new Error(
                        "Failed to fetch user details"
                    );

                const data = await response.json();
                setCurrentUser(data);
                setEditedUser(data);
            //update indexedDB w latest data 
                await userDB.update({ ...data, _id: "current_user"});

            } catch (error) {
                setError("Failed to load user information");
                // console.error(
                //     "Error fetching user details:",
                //     error
                // );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    // Check if user details have changed
    const hasChanges =
        currentUser.name !== editedUser.name ||
        currentUser.email !== editedUser.email;

    const handleInputChange = (e) => {
        // const { name, value } = e.target;
        setEditedUser({
             ...editedUser, 
            [e.target.name]: e.target.value
        });
        setSaveStatus(""); // Clear any previous status
    };
// saved chnages (indexed first, then api)
    const handleSave = async () => {
        try {
            setSaveStatus("saving");
            setCurrentUser(editedUser);
            // const response = await fetch(
            await userDB.update({
                ...editedUser, 
                _id: "current_user"});
             // update server
            const response = await fetch ("http://localhost:8000/api/user",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(editedUser)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to update");
            }
            await userDB.update({...editedUser, _id: "current_user"});
            
            setCurrentUser(editedUser);
            setSaveStatus("success");

            setTimeout(() => setSaveStatus(""), 2000); 
        } catch (error) {
            setSaveStatus("error");
            setError(error.message)

            setTimeout(() => setSaveStatus(""), 3000);
        }  
        
    };    
          // Add new useEffect to fetch groups
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                // check indexedDB
                const cachedGroups = await groupsDB.getAll("current_user");
                if (cachedGroups.length > 0){
                    setGroups(cachedGroups);
                }
                // always fetch from api
                const response = await fetch(
                    "http://localhost:8000/api/groups",
                    {
                        credentials: "include"
                    }
                );

                if (!response.ok)
                    throw new Error("Failed to fetch groups");

                const data = await response.json();
                setGroups(data);
                // updates indexedDB
                for (let group of data) {
                    await groupsDB.update(group);
                }
            } catch (error) {
                setGroupsError("Failed to load groups");
                console.error("Error fetching groups:", error);
            }
        };

        fetchGroups();
    }, []);    

    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme) {
            setTheme(currentTheme);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.body.className = theme;
        console.log(theme);
        // if (darkMode) {
        //     localStorage.setItem("theme", "dark-mode");
        //     document.body.classList.add("dark-mode");
        // } else {
        //     localStorage.setItem("theme", "light-mode");
        //     document.body.classList.remove("dark-mode");
        // }
    }, [theme]);

    // Dark mode logic
    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    // Logout logic
    const handleLogout = async () => {
        try {
            const db = await userDB.initDB();
            await clearDB();

            setIsLoggedIn(false);
            navigate("/account");
            
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

  
// handle logout adn clear indexedDB
    const handleLeaveClick = (group) => {
        setSelectedGroup(group);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedGroup(null);
    };

    const handleLeaveGroup = async (groupId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/groups/${groupId}/leave`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to leave group");
            }

            // Remove group from local state
            setGroups(groups.filter((g) => g._id !== groupId));
            setModalOpen(false);
            setSelectedGroup(null);
        } catch (error) {
            setGroupsError("Failed to leave group");
            console.error("Error leaving group:", error);
            setModalOpen(false);
        }
    };

    if (isLoading) {
        return <S.LoadingSpinner>Loading...</S.LoadingSpinner>;
    }

    return (
        <S.SettingsContainer>
            <S.SectionContainer>
                <S.SectionHeader>Appearance</S.SectionHeader>
                <S.ContentCard>
                    {/* <S.ToggleWrapper>
                            <S.IconWrapper active={darkMode}>
                                {darkMode ? <FaMoon /> : <FaSun />}
                            </S.IconWrapper>
                            Dark Mode
                            <S.Toggle
                                onClick={toggleTheme}
                                active={darkMode}
                                aria-label="Toggle dark mode"
                            />
                        </S.ToggleWrapper> */}
                    <S.ThemeSelection
                        onClick={() =>
                            toggleTheme("light-mode")
                        }
                        active={"light-mode"}
                        selected={theme === "light-mode"}
                    >
                        <S.IconWrapper>
                            <S.Circle color="#f2c4bb" />
                        </S.IconWrapper>
                        Classic
                    </S.ThemeSelection>
                    <S.ThemeSelection
                        onClick={() => toggleTheme("dark-mode")}
                        active={"dark-mode"}
                        selected={theme === "dark-mode"}
                    >
                        <S.Circle color="#000000" />
                        Dark
                    </S.ThemeSelection>
                    <S.ThemeSelection
                        active={theme === "blue-theme"}
                        onClick={() => setTheme("blue-theme")}
                        selected={theme === "blue-theme"}
                    >
                        <S.Circle color="#9bc4e2" />
                        Sky
                    </S.ThemeSelection>
                    <S.ThemeSelection
                        active={theme === "min-theme"}
                        onClick={() => setTheme("min-theme")}
                        selected={theme === "min-theme"}
                    >
                        <S.Circle color="#d3d3d3" />
                        Minimalist
                    </S.ThemeSelection>
                </S.ContentCard>
            </S.SectionContainer>

            <S.SectionContainer>
                <S.SectionHeader>Information</S.SectionHeader>
                <S.ContentCard>
                    <S.InputWrapper>
                        <S.InputHeader>
                            <S.InputLabel>Name</S.InputLabel>
                        </S.InputHeader>
                        <S.InputField
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            // style={{
                            //     color: darkMode
                            //         ? "#333"
                            //         : "inherit"
                            // }}
                        />
                    </S.InputWrapper>
                    <S.InputWrapper>
                        <S.InputHeader>
                            <S.InputLabel>Email</S.InputLabel>
                        </S.InputHeader>
                        <S.InputField
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email"
                        />
                    </S.InputWrapper>
                    {error && (
                        <S.ErrorMessage>{error}</S.ErrorMessage>
                    )}
                    {hasChanges && (
                        <S.SaveButton
                            onClick={handleSave}
                            disabled={saveStatus === "saving"}
                            status={saveStatus}
                        >
                            {saveStatus === "saving" ? (
                                <>
                                    <FaSync
                                        style={{
                                            animation:
                                                "spin 1s linear infinite"
                                        }}
                                    />
                                    Updating...
                                </>
                            ) : saveStatus === "success" ? (
                                "Updated!"
                            ) : (
                                <>
                                    <FaSync />
                                    Update Info
                                </>
                            )}
                        </S.SaveButton>
                    )}
                </S.ContentCard>
            </S.SectionContainer>

            <S.SectionContainer>
                <S.SectionHeader>Groups</S.SectionHeader>
                <S.ContentCard>
                    {groupsError ? (
                        <S.ErrorMessage>
                            {groupsError}
                        </S.ErrorMessage>
                    ) : groups.length === 0 ? (
                        <S.EmptyMessage>
                            No groups joined yet
                        </S.EmptyMessage>
                    ) : (
                        <S.GroupsList>
                            {groups.map((group) => (
                                <S.GroupItem key={group._id}>
                                    <S.GroupName>
                                        {group.name}
                                    </S.GroupName>
                                    <S.RemoveButton
                                        onClick={() =>
                                            handleLeaveClick(
                                                group
                                            )
                                        }
                                        aria-label="Leave group"
                                    >
                                        <FaLeaveGroup />
                                    </S.RemoveButton>
                                </S.GroupItem>
                            ))}
                        </S.GroupsList>
                    )}
                </S.ContentCard>
            </S.SectionContainer>

            <S.LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Sign Out
            </S.LogoutButton>

            {modalOpen && (
                <S.ModalOverlay onClick={handleCloseModal}>
                    <S.ModalContent
                        onClick={(e) => e.stopPropagation()}
                    >
                        <S.ModalTitle>
                            Leaving Group.
                        </S.ModalTitle>
                        <div>
                            Are you sure you want to leave?
                        </div>
                        <S.ModalButtons>
                            <S.ModalButton
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </S.ModalButton>
                            <S.ModalButton
                                variant="confirm"
                                onClick={() =>
                                    handleLeaveGroup(
                                        selectedGroup._id
                                    )
                                }
                            >
                                Leave
                            </S.ModalButton>
                        </S.ModalButtons>
                    </S.ModalContent>
                </S.ModalOverlay>
            )}
        </S.SettingsContainer>
    );
}

export default Settings;
