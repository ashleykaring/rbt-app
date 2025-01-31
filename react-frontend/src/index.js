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
import { initDB } from "./utils/db";

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

// Register Service Worker (FOR PWA)
if (
    "serviceWorker" in navigator &&
    process.env.NODE_ENV === "production"
) {
    window.addEventListener("load", async () => {
        try {
            // First check if there's already a service worker
            const registration =
                await navigator.serviceWorker.getRegistration();
            if (!registration) {
                // Only register if one doesn't exist
                await navigator.serviceWorker.register(
                    "/service-worker.js",
                    {
                        scope: "/"
                    }
                );
                console.log(
                    "ServiceWorker registration successful"
                );
            }
        } catch (err) {
            console.log(
                "ServiceWorker registration failed: ",
                err
            );
        }
    });
}

// Initialize IndexedDB
window.addEventListener("load", () => {
    initDB()
        .then(() => {
            console.log("IndexedDB initialized successfully");
        })
        .catch((error) => {
            console.error(
                "Error initializing IndexedDB:",
                error
            );
        });
});

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
