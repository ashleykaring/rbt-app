/*
IMPORTS
*/

// Libraries
import React, { useState } from "react";
import { FiPlus, FiCopy, FiShare, FiX } from "react-icons/fi";

// Styles
import {
    CreateContainer,
    InitialView,
    PlusIcon,
    CreateText,
    NameInput,
    CreateButton,
    ShareHeader,
    CodeContainer,
    CodeDisplay,
    IconsContainer,
    Icon,
    Toast,
    CloseButton
} from "./group.styles";

/*
RENDER
*/
function CreateGroup() {
    // States
    const [stage, setStage] = useState("initial");
    const [groupName, setGroupName] = useState("");
    const [groupCode, setGroupCode] = useState("");
    const [showToast, setShowToast] = useState(false);

    /* FLAGGED FOR UPDATE */
    const generateGroupCode = () => {
        // !!! Updated to be a backend call to ensure unique code
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return code;
    };

    /*
    EVENT HANDLERS
    */

    // Handles the initial creation of the group
    const handleCreate = () => {
        if (stage === "initial") {
            setStage("naming");
        }
    };

    // Handles the confirmation of the group name
    const handleConfirmName = () => {
        if (groupName.trim()) {
            const code = generateGroupCode();
            setGroupCode(code);
            setStage("code");
        }
    };

    // Handles the copying/sharing of the group code
    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        setShowToast(true);
    };

    // Handles the closing of the create group modal
    const handleClose = () => {
        setStage("initial");
        setGroupName("");
        setGroupCode("");
    };

    /*
    RENDER
    */
    const renderContent = () => {
        switch (stage) {
            case "initial":
                return (
                    <InitialView onClick={handleCreate}>
                        <PlusIcon>
                            <FiPlus />
                        </PlusIcon>
                        <CreateText>Create Group</CreateText>
                    </InitialView>
                );
            case "naming":
                return (
                    <>
                        <CloseButton onClick={handleClose}>
                            <FiX />
                        </CloseButton>
                        <ShareHeader>
                            Name your group:
                        </ShareHeader>
                        <NameInput
                            value={groupName}
                            onChange={(e) =>
                                setGroupName(e.target.value)
                            }
                            placeholder="Enter group name..."
                            autoFocus
                        />
                        <CreateButton
                            onClick={handleConfirmName}
                            disabled={!groupName.trim()}
                        >
                            Create
                        </CreateButton>
                    </>
                );
            case "code":
                return (
                    <>
                        <CloseButton onClick={handleClose}>
                            <FiX />
                        </CloseButton>
                        <ShareHeader>
                            Share this code:
                        </ShareHeader>
                        <CodeContainer>
                            <CodeDisplay>
                                {groupCode}
                            </CodeDisplay>
                        </CodeContainer>
                        <IconsContainer>
                            <Icon onClick={handleCopyCode}>
                                <FiCopy />
                            </Icon>
                            <Icon>
                                <FiShare />
                            </Icon>
                        </IconsContainer>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <CreateContainer
                expanded={stage !== "initial"}
                onClick={
                    stage === "initial"
                        ? handleCreate
                        : undefined
                }
            >
                {renderContent()}
            </CreateContainer>
            {showToast && (
                <Toast
                    onAnimationEnd={() => setShowToast(false)}
                >
                    Code copied to clipboard!
                </Toast>
            )}
        </>
    );
}

export default CreateGroup;
