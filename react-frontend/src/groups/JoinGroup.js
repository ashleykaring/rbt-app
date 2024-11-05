/*
IMPORTS
*/

// Libraries
import React, { useState } from "react";
import { FiUserPlus, FiX } from "react-icons/fi";

// Styles
import {
    CloseButton,
    InitialView,
    Toast,
    JoinIcon,
    JoinText,
    CodeInput,
    Digit,
    JoinHeader,
    JoinButton,
    JoinContainer
} from "./group.styles";

/*
RENDER
*/

function JoinGroup() {
    const [stage, setStage] = useState("initial");
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastSuccess, setToastSuccess] = useState(true);

    /*
    EVENT HANDLERS
    */

    // Handles the initial join button click
    const handleJoin = () => {
        if (stage === "initial") {
            setStage("code");
        }
    };

    // Handles the digit change for the group code
    const handleDigitChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple characters per digit

        const newCode = [...code];
        newCode[index] = value.toUpperCase();
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(
                `digit-${index + 1}`
            );
            if (nextInput) nextInput.focus();
        }
    };

    // Handles the key down event for the group code
    const handleKeyDown = (index, e) => {
        if (
            e.key === "Backspace" &&
            !code[index] &&
            index > 0
        ) {
            const prevInput = document.getElementById(
                `digit-${index - 1}`
            );
            if (prevInput) prevInput.focus();
        }
    };

    // Handles the confirmation of the group code
    /* FLAGGED FOR UPDATE */
    const handleConfirmCode = () => {
        const joinCode = code.join("");

        // !!! Later: This should be a database call to:
        // 1. Check if group exists with this code
        // 2. If exists, append current user to group.members
        // 3. Append group to current user's groups list
        // 4. Return success/failure

        if (joinCode === "123456") {
            setToastSuccess(true);
            setToastMessage("Group joined successfully!");
            setShowToast(true);
            setStage("initial");
            setCode(["", "", "", "", "", ""]);
        } else {
            setToastSuccess(false);
            setToastMessage("Group not found!");
            setShowToast(true);
        }
    };

    // Handles the closing of the join group modal
    const handleClose = () => {
        setStage("initial");
        setCode(["", "", "", "", "", ""]);
    };

    /*
    RENDER
    */

    // Renders the content based on the current stage
    const renderContent = () => {
        switch (stage) {
            case "initial":
                return (
                    <InitialView onClick={handleJoin}>
                        <JoinIcon>
                            <FiUserPlus />
                        </JoinIcon>
                        <JoinText>Join Group</JoinText>
                    </InitialView>
                );
            case "code":
                return (
                    <>
                        <CloseButton onClick={handleClose}>
                            <FiX />
                        </CloseButton>
                        <JoinHeader>
                            Enter group code:
                        </JoinHeader>
                        <CodeInput>
                            {code.map((digit, index) => (
                                <Digit
                                    key={index}
                                    id={`digit-${index}`}
                                    value={digit}
                                    onChange={(e) =>
                                        handleDigitChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) =>
                                        handleKeyDown(index, e)
                                    }
                                    maxLength={1}
                                    placeholder="_"
                                    autoFocus={index === 0}
                                />
                            ))}
                        </CodeInput>
                        <JoinButton
                            onClick={handleConfirmCode}
                            disabled={code.some(
                                (digit) => !digit
                            )}
                        >
                            Join
                        </JoinButton>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <JoinContainer
                expanded={stage !== "initial"}
                onClick={
                    stage === "initial" ? handleJoin : undefined
                }
            >
                {renderContent()}
            </JoinContainer>
            {showToast && (
                <Toast
                    onAnimationEnd={() => setShowToast(false)}
                    style={{
                        background: toastSuccess
                            ? "#38a169"
                            : "#e53e3e"
                    }}
                >
                    {toastMessage}
                </Toast>
            )}
        </>
    );
}

export default JoinGroup;
