/* 
LIBRARY & STYLE IMPORTS
 */
// Libraries
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { API_BASE_URL } from "./config.js";

// Layout
import AppLayout from "./layout/AppLayout";

// Styles
import "./index.css";

/* 
PAGE IMPORTS
 */
// Account Flow
import AccountFlow from "./login/accountFlow.js";

// Main Tab Pages
import HomePage from "./home/HomePage.js";
import SearchPage from "./search/SearchPage.js";
import NewEntry from "./new-entry/EntryPage.js";
import GroupsPage from "./groups/groupsPage.js";
import Settings from "./settings/SettingsPage.js";

// Full Screen Pages
import GroupEntries from "./groups/groupEntries.js";
import TagEntries from "./search/TagEntries.js";

const MainAppRoutes = ({
    setIsLoggedIn,
    setUserId,
    userId
}) => {
    // Check for dark mode and pass through
    useEffect(() => {
        const darkMode =
            localStorage.getItem("theme") === "dark-mode";
        document.body.classList.toggle("dark-mode", darkMode);
    }, []);

    return (
        <Routes>
            {/* Tab Routes */}
            <Route path="/" element={<HomePage />} />
            <Route
                path="/search"
                element={<SearchPage userId={userId} />}
            />
            <Route path="/new-entry" element={<NewEntry />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route
                path="/settings"
                element={
                    <Settings setIsLoggedIn={setIsLoggedIn} />
                }
            />

            {/* Full Screen Routes */}
            <Route
                path="/groups/:groupId/:groupName"
                element={<GroupEntries userId={userId} />}
            />
            <Route
                path="/search/:tagId/:tagName"
                element={<TagEntries />}
            />
        </Routes>
    );
};

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/auth/verify`,
                    {
                        credentials: "include"
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(true);
                    setUserId(data.userId);
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUserId(null);
            }
        };
        checkAuth();
    }, []);

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
                            setUserId={setUserId}
                        />
                    )
                }
            />
            <Route
                path="/*"
                element={
                    isLoggedIn ? (
                        <AppLayout>
                            <MainAppRoutes
                                setIsLoggedIn={setIsLoggedIn}
                                setUserId={setUserId}
                                userId={userId}
                            />
                        </AppLayout>
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
