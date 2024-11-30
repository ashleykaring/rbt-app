import React from "react";
import { Link } from "react-router-dom";
import { MdSettings } from 'react-icons/md';
import "./Header.css";

function Header() {
    return (
        <header className="header">
            <img
                src="/RBDLogoRounded.png"
                alt="RBT Logo"
                // className="logo"
            />
            <nav>
                <div className="settings-link">
                        <Link to="/settings" className="settings">
                            <MdSettings className="settings-icon" />
                        </Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;
