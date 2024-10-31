import React from "react";
import { Link } from "react-router-dom";
import { MdHome, MdAddCircle } from "react-icons/md";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <nav>
                <ul className="footer-links">
                    <li>
                        <Link to="/" className="footer-link">
                            <MdHome className="footer-icon" />
                            <span className="footer-text">
                                Home
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/new-entry"
                            className="footer-link"
                        >
                            <MdAddCircle className="footer-icon" />
                            <span className="footer-text">
                                New Entry
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
