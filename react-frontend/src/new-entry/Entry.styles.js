import styled from "styled-components";

export const EntryContainer = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`;

export const EntryTitle = styled.h1`
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-weight: 600;
    position: relative;
    padding-left: 1.2rem;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 90%;
        width: 4px;
        background: var(--fill-color);
        border-radius: 2px;
    }
`;

export const EntryField = styled.div`
    margin-bottom: 1rem;

    h3 {
        font-size: 1.2rem;
        color: var(--text-primary);
        margin-bottom: 0.8rem;
        font-weight: 500;
    }
`;

export const EntryInput = styled.input`
    width: 100%;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    background-color: var(--card-background);
    color: var(--text-primary);
    transition: border-color 0.2s;

    &::placeholder {
        color: var(--text-secondary);
    }

    &:focus {
        outline: none;
        border-color: var(--fill-color);
    }
`;

export const EntryText = styled.div`
    font-size: 1rem;
    color: var(--text-primary);
    padding: 1rem;
    background-color: var(--card-background);
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--background-color);
    }
`;

export const EntryFieldTitle = styled.h3`
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
    font-weight: 700;
`;

export const TagsSection = styled.div`
    margin-top: 0.5rem;
`;

export const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 1rem;
`;

export const TagPill = styled.div`
    background-color: ${(props) =>
        props.theme.lightPink || "rgba(242, 196, 187, 0.5)"};
    color: var(--text-primary);
    padding: 0.4rem 0.8rem;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.9rem;

    button {
        background: none;
        border: none;
        color: var(--text-primary);
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        opacity: 0.7;

        &:hover {
            opacity: 1;
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
    margin: 2rem auto 0;
    max-width: 250px;
`;

export const SubmitWrapper = styled.div`
    background-color: var(--fill-color);
    border-radius: 12px;
    padding: 1rem 1rem 0.8rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--button-color);
    }
`;

export const SubmitText = styled.div`
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1.3rem;
    text-align: center;
`;

export const VisibilityToggle = styled.div`
    display: flex;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 16px;
    padding: 3px;
    width: 160px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
`;

export const ToggleOption = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 4px 8px;
    border: none;
    border-radius: 14px;
    background: ${(props) =>
        props.selected
            ? "rgba(255, 255, 255, 0.9)"
            : "transparent"};
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.8rem;

    svg {
        font-size: 0.9rem;
    }

    span {
        font-size: 0.8rem;
        font-weight: 500;
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
`;

export const FieldLabel = styled.span`
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    display: block;
`;
