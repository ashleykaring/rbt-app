/*
IMPORTS
*/
import React, { useState } from "react";
import {
    useParams,
    useNavigate,
    useLocation
} from "react-router-dom";
import {
    FiCopy,
    FiShare,
    FiHash,
    FiChevronLeft
} from "react-icons/fi";

// Import mock data
import mockEntries from "./groupEntries.json";

// Styles
import {
    Container,
    ContentContainer,
    EntryPageTitle,
    CodeButton,
    GroupCodeDisplay,
    ActionIcon,
    Toast,
    HeaderRow,
    BackButton,
    HeaderContainer,
    getGradient,
    EntriesContainer,
    EntryCard,
    EntryName,
    EntrySection,
    EntryText
} from "./group.styles";

/*
RENDER
*/
function GroupEntries() {
    // Constants & states
    const { groupId, groupName } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const groupCode = location.state?.group_code;
    const [showToast, setShowToast] = useState(false);
    const [showCode, setShowCode] = useState(false);

    // Get gradient for the group
    const gradient = getGradient(groupId);

    // Function for copying group code
    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        setShowToast(true);
    };

    return (
        <Container>
            <ContentContainer>
                <HeaderContainer>
                    <HeaderRow>
                        <BackButton
                            onClick={() => navigate("/groups")}
                        >
                            <FiChevronLeft />
                        </BackButton>
                        <EntryPageTitle gradient={gradient}>
                            {decodeURIComponent(groupName)}
                        </EntryPageTitle>
                        <CodeButton
                            onClick={() =>
                                setShowCode(!showCode)
                            }
                        >
                            <FiHash />
                        </CodeButton>
                    </HeaderRow>
                </HeaderContainer>

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

                {/* We can now map through the mock entries */}
                <EntriesContainer>
                    {mockEntries.entries.map((entry) => (
                        <EntryCard key={entry.userId}>
                            <EntryName>
                                {entry.userName}
                            </EntryName>
                            <EntrySection type="rose">
                                <EntryText>
                                    {entry.rose_text}
                                </EntryText>
                            </EntrySection>
                            <EntrySection type="bud">
                                <EntryText>
                                    {entry.bud_text}
                                </EntryText>
                            </EntrySection>
                            <EntrySection type="thorn">
                                <EntryText>
                                    {entry.thorn_text}
                                </EntryText>
                            </EntrySection>
                        </EntryCard>
                    ))}
                </EntriesContainer>
            </ContentContainer>
        </Container>
    );
}

export default GroupEntries;
