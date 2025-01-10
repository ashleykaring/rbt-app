import React from "react";
import { useLocation } from "react-router-dom";
import {
    MdHome,
    MdSearch,
    MdGroups,
    MdSettings
} from "react-icons/md";
import { IoRose } from "react-icons/io5";
import {
    HeaderContainer,
    ViewInfo,
    ViewTitle
} from "./Header.styles";

function Header() {
    const location = useLocation();
    const path = location.pathname;

    const viewConfigs = {
        "/": { icon: <MdHome />, title: "Home" },
        "/search": { icon: <MdSearch />, title: "Search" },
        "/new-entry": { icon: <IoRose />, title: "New Entry" },
        "/groups": { icon: <MdGroups />, title: "Groups" },
        "/settings": { icon: <MdSettings />, title: "Settings" }
    };

    // Handle nested routes (like group entries)
    const currentView = path.startsWith("/groups/")
        ? viewConfigs["/groups"]
        : viewConfigs[path] || viewConfigs["/"];

    return (
        <HeaderContainer>
            <ViewInfo>
                {currentView.icon}
                <ViewTitle>{currentView.title}</ViewTitle>
            </ViewInfo>
        </HeaderContainer>
    );
}

export default Header;
