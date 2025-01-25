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
import styled from "styled-components";

// Navigation
import Header from "./navigation/Header.js";
import Footer from "./navigation/Footer.js";

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

// Tab views are the 5 main views with header and footer
const TabView = ({ children }) => (
    <>
        <Header />
        <main className="main-content">{children}</main>
        <Footer />
    </>
);

// Full screen views do not show header or footer
const FullScreenView = ({ children }) => (
    <main className="main-content">{children}</main>
);

const MainAppRoutes = ({ setIsLoggedIn }) => {
    // Check for dark mode and pass through
    useEffect(() => {
        const darkMode =
            localStorage.getItem("theme") === "dark-mode";
        document.body.classList.toggle("dark-mode", darkMode);
    }, []);

    return (
        <Routes>
            {/* Tab Routes - with Header & Footer */}
            <Route
                path="/"
                element={
                    <TabView>
                        <HomePage />
                    </TabView>
                }
            />
            <Route
                path="/search"
                element={
                    <TabView>
                        <SearchPage />
                    </TabView>
                }
            />
            <Route
                path="/new-entry"
                element={
                    <TabView>
                        <NewEntry />
                    </TabView>
                }
            />
            <Route
                path="/groups"
                element={
                    <TabView>
                        <GroupsPage />
                    </TabView>
                }
            />
            <Route
                path="/settings"
                element={
                    <TabView>
                        <Settings
                            setIsLoggedIn={setIsLoggedIn}
                        />
                    </TabView>
                }
            />

            {/* Full Screen Routes - no Header & Footer */}
            <Route
                path="/groups/:groupId/:groupName"
                element={
                    <FullScreenView>
                        <GroupEntries />
                    </FullScreenView>
                }
            />

            <Route
                path="/search/:tagId/:tagName"
                element={<TagEntries />}
            />
        </Routes>
    );
};

// Protects the main app routes by checking if the user is logged in and routing to the account flow if not
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Checks if the user is logged in
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

    // Render the route accordingly
    return (
        <Routes>
            {/* Account Flow */}
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

            {/* Protected Routes */}
            <Route
                path="/*"
                element={
                    isLoggedIn ? (
                        <MainAppRoutes
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

// Renders the app and forces a phone look to the website
ReactDOM.render(
    <Router>
        <PhoneContainer>
            <App />
        </PhoneContainer>
    </Router>,
    document.getElementById("root")
);
