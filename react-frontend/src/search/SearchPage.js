import React from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`;

const SearchText = styled.h1`
    font-size: 2rem;
    color: #2c3e50;
`;

function SearchPage() {
    return (
        <SearchContainer>
            <SearchText>Search Page</SearchText>
        </SearchContainer>
    );
}

export default SearchPage;
