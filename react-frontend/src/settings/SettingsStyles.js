import styled from "styled-components";

export const SettingsContainer = styled.div`
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 1rem 1rem;
    margin-top: 20px;
`;

export const PageTitle = styled.h1`
    font-size: 1.75rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 1.5rem;
    letter-spacing: -0.5px;
`;

export const SectionContainer = styled.section`
    margin-bottom: 2rem;
`;

export const SectionHeader = styled.h2`
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

export const ContentCard = styled.div`
    background: var(--card-background);
    border-radius: 16px;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

    &:hover {
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
    }
`;

export const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 2rem auto;
    padding: 0.75rem 1.5rem;
    border: none;
    background: var(--card-background);
    color: var(--text-secondary);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

    &:hover {
        color: #ff4757;
        border-color: #ff4757;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.1);
    }
`;

export const ToggleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 8px;
    color: var(--text-primary);
    font-weight: 500;
`;

export const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: ${(props) =>
        props.active ? "#23a6d5" : "var(--text-secondary)"};
    transition: color 0.3s ease;
`;

export const Toggle = styled.button`
    width: 44px;
    height: 24px;
    border-radius: 24px;
    background: ${(props) =>
        props.active ? "#23a6d5" : "var(--border-color)"};
    position: relative;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    margin-left: auto;

    &::before {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: var(--card-background);
        top: 3px;
        left: ${(props) => (props.active ? "23px" : "3px")};
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
`;

export const InputField = styled.input`
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 0.95rem;
    background: var(--card-background);
    color: var(--text-primary);
    transition: all 0.2s ease;

    /* Override browser autofill styles */
    &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset !important;
        -webkit-text-fill-color: #2c3e50 !important;
        transition: background-color 5000s ease-in-out 0s;
    }

    &:focus {
        outline: none;
        border-color: #23a6d5;
        box-shadow: 0 0 0 2px rgba(35, 166, 213, 0.1);
    }

    &:hover {
        border-color: #23a6d5;
    }
`;

export const InputLabel = styled.label`
    display: block;
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 5px;
`;

export const FieldWrapper = styled.div`
    margin-bottom: 1rem;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const SaveButton = styled.button`
    background: ${(props) =>
        props.status === "success"
            ? "#27ae60"
            : props.status === "error"
            ? "#ff4757"
            : "#23a6d5"};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: ${(props) =>
        props.disabled ? "not-allowed" : "pointer"};
    transition: all 0.2s ease;
    margin: 0.5rem auto 0;
    opacity: ${(props) => (props.disabled ? 0.7 : 1)};
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;

    &:hover {
        background: ${(props) =>
            props.status === "success"
                ? "#219a52"
                : props.status === "error"
                ? "#e74c3c"
                : "#1e95c0"};
        transform: ${(props) =>
            props.disabled ? "none" : "translateY(-1px)"};
    }

    svg {
        font-size: 14px;
    }
`;

export const InputWrapper = styled(FieldWrapper)`
    position: relative;
    display: flex;
    flex-direction: column;
`;

export const InputHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
`;

export const LoadingSpinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    color: var(--text-secondary);
`;

export const ErrorMessage = styled.div`
    color: #ff4757;
    font-size: 0.9rem;
    margin-top: 0.5rem;
`;
