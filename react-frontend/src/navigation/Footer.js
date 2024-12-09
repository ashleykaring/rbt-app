/*
IMPORTS
*/
import React from "react";
import { Link } from "react-router-dom";
import { MdHome, MdAddCircle, MdGroups } from "react-icons/md";

// Styles
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <nav>
                <ul className="footer-links">
                    <li>
                        <Link 
                            to="/" 
                            className="footer-link"
                        >
                            <MdHome className="footer-icon" />
                            <span className="footer-text">
                                Home
                            </span>
                        </Link>
                    </li>
                    <div className="circle">
                        <li>
                            <Link 
                                to="/new-entry" 
                                className="footer-link"
                                id="new-entry"
                            >
                                <MdAddCircle className="footer-icon" id="new-icon" />
                                <span className="footer-text">
                                    New Entry
                                </span>
                            </Link>
                        </li>
                    </div>
                    <li>
                        <Link
                            to="/groups"
                            className="footer-link"
                        >
                            <MdGroups className="footer-icon" />
                            <span className="footer-text">
                                Groups
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
