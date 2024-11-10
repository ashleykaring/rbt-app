// Libraries
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// Login & Create Account
import Login from "./login/login.js";
import CreateAccount from "./login/createAccount.js";

// Main Pages
import HomePage from "./home/HomePage.js";
import NewEntry from "./new-entry/EntryPage.js";
import GroupsPage from "./groups/groupsPage.js";
import GroupEntries from "./groups/groupEntries.js";
import Settings from "./settings/SettingsPage.js"

// Navigation
import Header from "./navigation/Header.js";
import Footer from "./navigation/Footer.js";
import "./index.css";

const BYPASS_AUTH = true;

const MainAppFlow = () => {
    useEffect(() => {
        const darkMode = localStorage.getItem('theme');
        if (darkMode) {
            document.body.classList.add('dark-mode'); // apply global dark-mode class
        }
        const userId = localStorage.getItem("userId");
        console.log("MainAppFlow - Current userId:", userId);
    }, []);

    return (
        <div className="mobile-container">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route 
                        path="/" 
                        element={<HomePage />} 
                    />
                    <Route
                        path="/new-entry"
                        element={<NewEntry />}
                    />
                    <Route
                        path="/settings"
                        element={<Settings />}
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
    const [isLoggedIn, setIsLoggedIn] = useState(BYPASS_AUTH);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        console.log("App - Authentication Status:", {
            isLoggedIn,
            userId: localStorage.getItem("userId") || "none"
        });
    }, [isLoggedIn]);

    if (BYPASS_AUTH) {
        console.log("Auth bypassed - entering MainAppFlow");
        return <MainAppFlow />;
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isLoggedIn ? (
                        <Navigate to="/" />
                    ) : (
                        <Login setIsLoggedIn={setIsLoggedIn} />
                    )
                }
            />
            <Route
                path="/create-account"
                element={
                    isLoggedIn ? (
                        <Navigate to="/" />
                    ) : (
                        <CreateAccount
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    )
                }
            />
            <Route
                path="/*"
                element={
                    isLoggedIn ? (
                        <MainAppFlow />
                    ) : (
                        <Navigate to="/login" />
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
