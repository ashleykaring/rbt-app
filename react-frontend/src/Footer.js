import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"

function Footer() {
    return(
        <footer>
            <nav>
                <ul className="footer-links">
                    <li>
                        <Link to="/dashboard" className="home">Home</Link>
                    </li>
                    <li>
                        <Link to="/new-entry" className="new">New Entry</Link>
                    </li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
