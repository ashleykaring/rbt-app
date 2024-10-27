/*
IMPORTS
*/
import React, { useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import Login from "./login/login";
import CreateAccount from "./login/createAccount";

// Development toggle for bypassing login
/*
SET TO FALSE TO ENABLE LOGIN FLOW (TRUE IF TESTING MAIN FLOW)
*/
const BYPASS_AUTH = true;

/*
PLACE THE MAIN APP FLOW HERE
*/
const MainAppFlow = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "24px",
                fontWeight: "bold"
            }}
        >
            Main App Flow
        </div>
    );
};

/*
Main App Component
*/
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(BYPASS_AUTH);

    // If bypassing auth, just show the main app
    if (BYPASS_AUTH) {
        return <MainAppFlow />;
    }

    // Otherwise show the login flow
    return (
        <Router>
            <Routes>
                {/* Login Route */}
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login
                                setIsLoggedIn={setIsLoggedIn}
                            />
                        )
                    }
                />

                {/* Create Account Route */}
                <Route
                    path="/create-account"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <CreateAccount
                                setIsLoggedIn={setIsLoggedIn}
                            />
                        )
                    }
                />

                {/* Dashboard aka main app (rename if you want to)*/}
                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn ? (
                            <MainAppFlow />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Default Route */}
                <Route
                    path="*"
                    element={<Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
}

export default App;
