// Libraries
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import styled from "styled-components";

// Account Flow
import AccountFlow from "./login/accountFlow.js";

// Main Pages
import HomePage from "./home/HomePage.js";
import NewEntry from "./new-entry/EntryPage.js";
import GroupsPage from "./groups/groupsPage.js";
import GroupEntries from "./groups/groupEntries.js";
import Settings from "./settings/SettingsPage.js";
import SearchPage from "./search/SearchPage.js";

// Navigation
import Header from "./navigation/Header.js";
import Footer from "./navigation/Footer.js";

// Styles
import "./index.css";

// bypass login variable for testing
const BYPASS_AUTH = false;

// Forces a phone look to the website
const PhoneContainer = styled.div`
    width: 100%;
    max-width: 450px;
    height: calc(100vh - 28px);
    margin: 14px 0;
    background: var(--background-color);
    position: relative;
    border: 0px solid #000000;
    border-radius: 40px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 400px) {
        margin: 0;
        height: 100vh;
        border: none;
        border-radius: 0;
        box-shadow: none;
    }
`;

const MainAppFlow = ({ setIsLoggedIn }) => {
    useEffect(() => {
        const darkMode =
            localStorage.getItem("theme") === "dark-mode";
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, []);

    return (
        <>
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/search"
                        element={<SearchPage />}
                    />
                    <Route
                        path="/new-entry"
                        element={<NewEntry />}
                    />
                    <Route
                        path="/groups"
                        element={<GroupsPage />}
                    />
                    <Route
                        path="/settings"
                        element={
                            <Settings
                                setIsLoggedIn={setIsLoggedIn}
                            />
                        }
                    />
                    <Route
                        path="/groups/:groupId/:groupName"
                        element={<GroupEntries />}
                    />
                </Routes>
            </main>
            <Footer />
        </>
    );
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/auth/verify",
                    {
                        credentials: "include"
                    }
                );
                setIsLoggedIn(response.ok);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    if (BYPASS_AUTH) {
        return (
            <Routes>
                <Route
                    path="/*"
                    element={
                        <MainAppFlow
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    }
                />
                <Route
                    path="/groups/:groupId/:groupName"
                    element={<GroupEntries />}
                />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route
                path="/account"
                element={
                    isLoggedIn ? (
                        <Navigate to="/" />
                    ) : (
                        <AccountFlow
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    )
                }
            />
            <Route
                path="/*"
                element={
                    isLoggedIn ? (
                        <MainAppFlow
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    ) : (
                        <Navigate to="/account" />
                    )
                }
            />
        </Routes>
    );
};

ReactDOM.render(
    <Router>
        <PhoneContainer>
            <App />
        </PhoneContainer>
    </Router>,
    document.getElementById("root")
);
