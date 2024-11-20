// Libraries
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// Account Flow
import AccountFlow from "./login/accountFlow.js";

// Main Pages
import HomePage from "./home/HomePage.js";
import NewEntry from "./new-entry/EntryPage.js";
import GroupsPage from "./groups/groupsPage.js";
import GroupEntries from "./groups/groupEntries.js";
import Settings from "./settings/SettingsPage.js";

// Navigation
import Header from "./navigation/Header.js";
import Footer from "./navigation/Footer.js";
import "./index.css";

const BYPASS_AUTH = false;

const MainAppFlow = ({ setIsLoggedIn }) => {
    useEffect(() => {
        const darkMode =
            localStorage.getItem("theme") === "dark-mode";
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        const userId = localStorage.getItem("userId");
        console.log("MainAppFlow - Current userId:", userId);
    }, []);

    return (
        <div className="mobile-container">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/new-entry"
                        element={<NewEntry />}
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
                        path="/groups"
                        element={<GroupsPage />}
                    />
                    <Route
                        path="/groups/:groupId/:groupName"
                        element={<GroupEntries />}
                    />
                </Routes>
            </main>
            <Footer />
        </div>
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

    useEffect(() => {
        console.log("App - Authentication Status:", {
            isLoggedIn,
            userId: localStorage.getItem("userId") || "none"
        });
    }, [isLoggedIn]);

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
        <App />
    </Router>,
    document.getElementById("root")
);
