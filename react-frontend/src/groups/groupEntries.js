import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 480px;
    height: 100vh;
    background: #fdf2f1;
    z-index: 2000;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background: #f2c4bb;
    color: #2c3e50;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(242, 196, 187, 0.3);

    &:hover {
        background: #edb5ab;
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-top: 2rem;
    color: #2c3e50;
    padding-right: 60px;
`;

function GroupEntries() {
    const { groupId, groupName } = useParams();
    const navigate = useNavigate();

    return (
        <Container>
            <CloseButton onClick={() => navigate("/groups")}>
                Close
            </CloseButton>
            <Title>
                Entries for {decodeURIComponent(groupName)}
            </Title>
        </Container>
    );
}

export default GroupEntries;
