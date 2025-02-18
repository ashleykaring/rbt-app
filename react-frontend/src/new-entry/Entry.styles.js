import styled from "styled-components";

export const EntryContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
`;

export const EntryTitle = styled.h1`
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 1rem;
    position: relative;
    padding-left: 1.2rem;
    letter-spacing: -0.5px;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 70%;
        width: 4px;
        background: var(--fill-color);
        border-radius: 2px;
        box-shadow: 0 2px 8px var(--fill-color);
    }

    &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 1.2rem;
        width: 100px;
        height: 3px;
        background: linear-gradient(
            90deg,
            var(--fill-color) 0%,
            transparent 100%
        );
        border-radius: 2px;
    }
`;

export const EntryField = styled.div`
    margin-bottom: 0.4rem;
    background: var(--card-background);
    padding: 0.8rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        border-color: var(--fill-color);
    }
`;

export const EditIcon = styled.div`
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    color: var(--text-secondary);
    opacity: 0.6;
    font-size: 1.1rem;
`;

export const EntryInput = styled.input`
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    font-size: 1rem;
    background-color: ${(props) =>
        props.theme.mode === "dark-mode"
            ? "#2a2a2a"
            : "var(--background-color)"};
    color: ${(props) =>
        props.theme.mode === "dark-mode"
            ? "#ffffff"
            : "#000000"};
    transition: all 0.2s;

    &::placeholder {
        color: var(--text-secondary);
        opacity: 0.7;
    }

    &:focus {
        outline: none;
        border-color: var(--fill-color);
        box-shadow: 0 0 0 3px var(--fill-color-transparent);
    }
`;

export const EntryText = styled.div`
    font-size: 1rem;
    color: ${(props) =>
        props.theme.mode === "dark-mode"
            ? "#ffffff"
            : "#000000"};
    padding: 1rem;
    background-color: ${(props) =>
        props.theme.mode === "dark-mode"
            ? "#2a2a2a"
            : "var(--background-color)"};
    border-radius: 12px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    transition: all 0.2s;
    min-height: 3.5rem;
    display: flex;
    align-items: center;

    &:hover {
        background-color: ${(props) =>
            props.theme.mode === "dark-mode"
                ? "#363636"
                : "var(--fill-color-transparent)"};
        border-color: var(--fill-color);
    }
`;

export const EntryFieldTitle = styled.h3`
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
    font-weight: 700;
`;

export const TagsSection = styled.div`
    margin-top: 1rem;
`;

export const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0.5rem;
    min-height: 32px;
    padding: 4px;
`;

export const TagPill = styled.div`
    background-color: var(--fill-color);
    color: var(--text-primary);
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 2px 4px var(--fill-color-transparent);

    button {
        background: none;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        opacity: 0.7;
        transition: all 0.2s;

        &:hover {
            opacity: 1;
            transform: scale(1.1);
        }
    }
`;

export const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0.2rem 0;
`;

export const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;

    input {
        opacity: 0;
        width: 0;
        height: 0;
    }
`;

export const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;

    &:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + & {
        background-color: var(--fill-color);
    }

    input:checked + &:before {
        transform: translateX(26px);
    }
`;

export const ToggleLabel = styled.span`
    color: var(--text-primary);
    font-size: 1rem;
`;

export const SubmitContainer = styled.div`
    margin: 3rem auto 1rem;
    max-width: 300px;
    width: 100%;
`;

export const SubmitWrapper = styled.div`
    background: linear-gradient(
        135deg,
        var(--fill-color) 0%,
        var(--button-color) 100%
    );
    border-radius: 16px;
    padding: 1.2rem 1.2rem 1rem;
    box-shadow: 0 4px 12px var(--fill-color-transparent);
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    cursor: pointer;
    transition: all 0.3s;
    opacity: ${(props) =>
        props.isEditMode && !props.hasChanges ? 0.6 : 1};
    border: 1px solid var(--button-color);

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px var(--fill-color-transparent);
        opacity: 1;
    }

    &:active {
        transform: translateY(0);
    }
`;

export const SubmitText = styled.div`
    color: var(--text-primary);
    font-weight: 700;
    font-size: 1.4rem;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const VisibilityToggle = styled.div`
    display: flex;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 4px;
    width: 180px;
    margin: 0 auto;
    position: relative;
    backdrop-filter: blur(4px);
`;

export const ToggleOption = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 12px;
    border: none;
    border-radius: 16px;
    background: ${(props) =>
        props.selected
            ? "rgba(255, 255, 255, 0.9)"
            : "transparent"};
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;

    svg {
        font-size: 1rem;
    }

    span {
        font-size: 0.9rem;
        font-weight: 600;
        display: ${(props) =>
            props.selected ? "block" : "none"};
    }

    &:hover {
        background: ${(props) =>
            props.selected
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.1)"};
    }
`;

export const ErrorMessage = styled.div`
    color: #ff4d4d;
    text-align: center;
    margin-top: 1rem;
    font-weight: 500;
    padding: 0.8rem;
    background: rgba(255, 77, 77, 0.1);
    border-radius: 8px;
    animation: shake 0.5s ease-in-out;

    @keyframes shake {
        0%,
        100% {
            transform: translateX(0);
        }
        25% {
            transform: translateX(-5px);
        }
        75% {
            transform: translateX(5px);
        }
    }
`;

export const FieldLabel = styled.span`
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--text-primary);
    margin-bottom: 0.6rem;
    display: block;
    position: relative;
    padding-left: 0.8rem;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 0.8rem;
        background: var(--fill-color);
        border-radius: 2px;
    }
`;
