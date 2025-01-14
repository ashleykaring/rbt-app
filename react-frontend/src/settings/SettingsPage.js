/*
IMPORTS
*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaMoon,
    FaSun,
    FaSignOutAlt,
    FaSync
} from "react-icons/fa";
import * as S from "./SettingsStyles";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

function Settings({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

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

    // Fetch user details on mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/user/details",
                    {
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
            } catch (error) {
                setError("Failed to load user information");
                console.error(
                    "Error fetching user details:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    // Check if values have changed
    const hasChanges =
        currentUser.name !== editedUser.name ||
        currentUser.email !== editedUser.email;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({
            ...prev,
            [name]: value
        }));
        setSaveStatus(""); // Clear any previous status
    };

    const handleSave = async () => {
        try {
            setSaveStatus("saving");
            const response = await fetch(
                "http://localhost:8000/api/user",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: editedUser.name,
                        email: editedUser.email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update"
                );
            }

            setCurrentUser(editedUser);
            setSaveStatus("success");
            setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
            setSaveStatus("error");
            setError(error.message);
            setTimeout(() => setSaveStatus(""), 3000);
        }
    };

    // Dark mode logic
    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme) {
            setDarkMode(currentTheme === "dark-mode");
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            localStorage.setItem("theme", "dark-mode");
            document.body.classList.add("dark-mode");
        } else {
            localStorage.setItem("theme", "light-mode");
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // Logout logic
    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:8000/api/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) throw new Error("Logout failed");
            setIsLoggedIn(false);
            navigate("/account");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    if (isLoading) {
        return <S.LoadingSpinner>Loading...</S.LoadingSpinner>;
    }

    return (
        <S.SettingsContainer>
            <S.SectionContainer>
                <S.SectionHeader>System</S.SectionHeader>
                <S.ContentCard>
                    <S.ToggleWrapper>
                        <S.IconWrapper active={darkMode}>
                            {darkMode ? <FaMoon /> : <FaSun />}
                        </S.IconWrapper>
                        Dark Mode
                        <S.Toggle
                            onClick={toggleTheme}
                            active={darkMode}
                            aria-label="Toggle dark mode"
                        />
                    </S.ToggleWrapper>
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
                            style={{
                                color: darkMode
                                    ? "#333"
                                    : "inherit"
                            }}
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
                    Groups placeholder
                </S.ContentCard>
            </S.SectionContainer>

            <S.LogoutButton onClick={handleLogout}>
                <FaSignOutAlt />
                Sign Out
            </S.LogoutButton>
        </S.SettingsContainer>
    );
}

export default Settings;
