/*
IMPORTS
*/

// Libraries
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCopy, FiShare, FiX, FiHash } from "react-icons/fi";

// Styles
import {
    Container,
    ContentContainer,
    CloseButton,
    Title,
    TitleRow,
    CodeButton,
    GroupCodeDisplay,
    ActionIcon,
    Toast
} from "./group.styles";

/*
RENDER
*/

function GroupEntries() {
    // Constants & states
    const { groupId, groupName } = useParams();
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [showCode, setShowCode] = useState(false);

    // TODO: This should come from your backend/state management
    // For now using groupId, but this should be replaced with actual group code
    const groupCode = "ABC123"; // This should be fetched based on groupId

    // Function for copying group code
    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        setShowToast(true);
    };

    return (
        <Container>
            <ContentContainer>
                <CloseButton
                    onClick={() => navigate("/groups")}
                >
                    <FiX />
                </CloseButton>

                <TitleRow>
                    <Title>
                        {decodeURIComponent(groupName)}
                    </Title>
                    <CodeButton
                        onClick={() => setShowCode(!showCode)}
                    >
                        <FiHash />
                    </CodeButton>
                </TitleRow>

                <GroupCodeDisplay isVisible={showCode}>
                    <span className="code">{groupCode}</span>
                    <ActionIcon onClick={handleCopyCode}>
                        <FiCopy />
                    </ActionIcon>
                    <ActionIcon>
                        <FiShare />
                    </ActionIcon>
                </GroupCodeDisplay>

                {showToast && (
                    <Toast
                        onAnimationEnd={() =>
                            setShowToast(false)
                        }
                    >
                        Code copied to clipboard!
                    </Toast>
                )}
            </ContentContainer>
        </Container>
    );
}

export default GroupEntries;
