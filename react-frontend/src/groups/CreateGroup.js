/*
IMPORTS
*/
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
function CreateGroup({ onGroupUpdate }) {
    const [stage, setStage] = useState("initial");
    const [groupName, setGroupName] = useState("");
    const [groupCode, setGroupCode] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE_URL = "http://localhost:8000"; // Match your backend port

    // Generates and verifies a unique group code
    const generateUniqueCode = async () => {
        console.log("Starting code generation");
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let isUnique = false;
        let code;

        while (!isUnique) {
            code = "";
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(
                    Math.floor(
                        Math.random() * characters.length
                    )
                );
            }
            console.log("Trying code:", code);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/groups/verify/${code}`
                );
                if (!response.ok) {
                    throw new Error(
                        `HTTP error! status: ${response.status}`
                    );
                }
                const data = await response.json();
                console.log("Verification response:", data);
                isUnique = data.isAvailable;
            } catch (error) {
                console.error("Error verifying code:", error);
                await new Promise((resolve) =>
                    setTimeout(resolve, 1000)
                );
                continue;
            }
        }
        console.log("Generated unique code:", code);
        return code;
    };

    // Creates the group with the backend
    const createGroup = async (name, code) => {
        const userId = localStorage.getItem("userId");
        console.log("Creating group with userId:", userId);

        if (!userId) {
            throw new Error("User not logged in");
        }

        try {
            console.log("Making create group request", {
                name,
                code,
                userId
            });

            const response = await fetch(
                `${API_BASE_URL}/groups/${userId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        group_code: code
                    })
                }
            );

            console.log("Create group response:", response);

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error || "Failed to create group"
                );
            }

            return await response.json();
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    };

    // Handles the initial creation of the group
    const handleCreate = () => {
        console.log(
            "Handle create clicked, current stage:",
            stage
        );
        if (stage === "initial") {
            setStage("naming");
        }
    };

    // Handles the confirmation of the group name
    const handleConfirmName = async () => {
        console.log(
            "Confirm name clicked with name:",
            groupName
        );
        if (!groupName.trim()) return;

        setIsLoading(true);
        try {
            console.log("Starting group creation process");
            const code = await generateUniqueCode();
            console.log("Generated code:", code);

            const newGroup = await createGroup(
                groupName.trim(),
                code
            );
            console.log("Group created:", newGroup);

            setGroupCode(code);
            setStage("code");
            setToastMessage("Group created successfully!");
            setShowToast(true);

            onGroupUpdate();
        } catch (error) {
            console.error("Error in handleConfirmName:", error);
            setToastMessage(
                error.message || "Failed to create group"
            );
            setShowToast(true);
            setStage("naming");
        } finally {
            setIsLoading(false);
        }
    };

    // Handles the copying/sharing of the group code
    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        setToastMessage("Code copied to clipboard!");
        setShowToast(true);
    };

    // Handles the closing of the create group modal
    const handleClose = () => {
        setStage("initial");
        setGroupName("");
        setGroupCode("");
    };

    // Render content based on current stage
    const renderContent = () => {
        switch (stage) {
            case "initial":
                return (
                    <InitialView>
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
                            disabled={isLoading}
                        />
                        <CreateButton
                            type="button"
                            onClick={handleConfirmName}
                            disabled={
                                !groupName.trim() || isLoading
                            }
                        >
                            {isLoading
                                ? "Creating..."
                                : "Create"}
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
                            <Icon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCode();
                                }}
                                title="Copy code"
                                type="button"
                            >
                                <FiCopy />
                            </Icon>
                            <Icon
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (navigator.share) {
                                        navigator
                                            .share({
                                                title: "Join my group in Rose Bud Thorn",
                                                text: `Join my group in Rose Bud Thorn using code: ${groupCode}`
                                            })
                                            .catch(
                                                console.error
                                            );
                                    } else {
                                        handleCopyCode();
                                    }
                                }}
                                title="Share code"
                                type="button"
                            >
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
                role="button"
                tabIndex={0}
            >
                {renderContent()}
            </CreateContainer>
            {showToast && (
                <Toast
                    onAnimationEnd={() => setShowToast(false)}
                >
                    {toastMessage}
                </Toast>
            )}
        </>
    );
}

export default CreateGroup;
