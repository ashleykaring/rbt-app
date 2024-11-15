import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    //FaSun,
    FaMoon,
    FaSignOutAlt
} from "react-icons/fa"; // Sun and Moon icons, and FaSignOutAlt
import "./settings.css";

function Settings({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);

    const toggleTheme = () => {
        // switch to dark or light depending on darkMode value
        setDarkMode((prevTheme) => !prevTheme);
        console.log(darkMode);
    };

    // on render, check theme and apply
    useEffect(() => {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme) {
            // if theme is dark mode, sets to true(dark mode on)
            setDarkMode(currentTheme === "dark-mode");
        }
    }, []);

    // when there is a change to mode, set theme
    useEffect(() => {
        if (darkMode) {
            localStorage.setItem("theme", "dark-mode");
            document.body.classList.add("dark-mode"); // apply global dark-mode class
        } else {
            localStorage.setItem("theme", "light-mode");
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // Add logout handler
    const handleLogout = () => {
        localStorage.removeItem("userId");
        setIsLoggedIn(false); // Update the auth state
        navigate("/login");
    };

    return (
        <>
            <h1 className="title">Settings</h1>
            <div className="settings-container">
                <div className="theme-setting">
                    <h2 className="item">Dark Mode</h2>
                    <div className="switch-container">
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={toggleTheme}
                            />
                            <span className="slider">
                                {darkMode ? <FaMoon /> : <></>}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Add Logout Section */}
                <div className="logout-section">
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt className="logout-icon" />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}

export default Settings;