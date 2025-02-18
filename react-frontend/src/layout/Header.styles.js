import styled from "styled-components";

export const HeaderContainer = styled.header`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    background-color: var(--background-color);
    display: flex;
    align-items: center;
    padding: 0 24px;
    z-index: 100;
    border-bottom: 2px solid var(--header-border);
`;

export const ViewInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    svg {
        margin-top: 5px;
        font-size: 32px;
        color: var(--header-icon);
        opacity: 0.9;
        filter: drop-shadow(0 2px 2px var(--fill-color));
    }
`;

export const ViewTitle = styled.h1`
    margin: 0;
    font-size: 32px;
    font-weight: 600;
    font-family: var(--font-header);
    color: var(--header-text);
    text-shadow: 2px 2px 3px var(--fill-color);
    letter-spacing: -0.2px;
`;
