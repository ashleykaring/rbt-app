import styled from "styled-components";

const gradients = [
    "linear-gradient(135deg, #D66C84 0%, #F0C5BC 100%)",
    "linear-gradient(135deg, #859880 0%, #2E5141 100%)",
    "linear-gradient(135deg, #E9B8C0 0%, #D66C84 100%)"
];

export const getGradient = (groupId) => {
    let hash = 0;
    for (let i = 0; i < groupId.length; i++) {
        const char = groupId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    const positiveHash = Math.abs(hash);
    return gradients[positiveHash % gradients.length];
};

export const PageContainer = styled.div`
    margin-horizontal: 5px;
    margin-bottom: 50px;
`;

export const Title = styled.h1`
    font-size: 2.4rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 1rem 0 3rem;
    position: relative;
    padding-left: 1rem;

    &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 70%;
        width: 4px;
        background: #f0c5bc;
        border-radius: 2px;
    }
`;

export const Subtitle = styled(Title).attrs({ as: "h2" })`
    font-size: 1.8rem;
    margin: 4rem 0 1.5rem;

    &:first-of-type {
        margin-top: 0;
    }
`;

export const GroupCard = styled.div`
    padding: 1.8rem;
    margin-bottom: 1.25rem;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: ${(props) => props.gradient || gradients[0]};
    color: white;
    box-shadow: 0 4px 15px rgba(214, 108, 132, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0)
        );
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(214, 108, 132, 0.3);

        &::before {
            opacity: 1;
        }
    }

    &:last-of-type {
        margin-bottom: 0;
    }

    h3 {
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0;
        letter-spacing: 0.01em;
    }
`;

export const GroupCardContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ChevronIcon = styled.div`
    display: flex;
    align-items: center;
    font-size: 1.4rem;
    opacity: 0.9;

    svg {
        transition: transform 0.2s ease;
    }

    ${GroupCard}:hover & svg {
        transform: translateX(3px);
    }
`;

export const ActionCard = styled.div`
    padding: 1.5rem;
    margin: 1rem 0;
    border-radius: 12px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: space-around;
`;

export const ActionButton = styled.button`
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    border: none;
    background-color: #4b79a1;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #283e51;
    }
`;

export const CreateContainer = styled(GroupCard)`
    background: #f8f9fa;
    min-height: ${(props) =>
        props.expanded ? "220px" : "auto"};
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    color: #2c3e50;
    border: 2px dashed #e9ecef;
    box-shadow: none;

    &:hover {
        border-color: #38a169;
        background: #ffffff;
    }

    ${(props) =>
        props.expanded &&
        `
        border: 2px solid #38a169;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    `}
`;

export const CloseButton = styled.div`
    position: absolute;
    top: 1.2rem;
    right: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f8f9fa;
    transition: all 0.2s ease;
    z-index: 10;

    svg {
        font-size: 1.4rem;
        color: #2c3e50;
    }

    &:hover {
        background: #e9ecef;
        transform: rotate(90deg);
    }
`;

export const InitialView = styled.div`
    display: flex;
    align-items: center;
    gap: 1.4rem;
    cursor: pointer;
    padding: 0.5rem 0;
`;

export const PlusIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        font-size: 2.4rem;
        color: #38a169;
    }
`;

export const CreateText = styled.span`
    font-size: 1.5rem;
    font-weight: 700;
    color: #38a169;
    letter-spacing: -0.02em;
`;

export const NameInput = styled.input`
    width: 100%;
    padding: 1.2rem;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    margin: 5px 0 10px;
    font-size: 1.2rem;
    background: #f8f9fa;
    transition: all 0.2s ease;

    &::placeholder {
        color: #95a5a6;
    }

    &:focus {
        outline: none;
        border-color: #38a169;
        background: white;
    }
`;

export const CreateButton = styled.button`
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    background: ${(props) =>
        props.disabled ? "#e9ecef" : "#38a169"};
    color: ${(props) => (props.disabled ? "#95a5a6" : "white")};
    font-weight: 700;
    font-size: 1.1rem;
    cursor: ${(props) =>
        props.disabled ? "not-allowed" : "pointer"};
    transition: all 0.2s ease;
    display: block;
    margin: 0 auto;
    letter-spacing: 0.02em;

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(56, 161, 105, 0.2);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }
`;

export const ShareHeader = styled.h3`
    text-align: center;
    font-size: 1.4rem;
    margin: 0.5rem auto 1.4rem;
    color: #38a169;
    font-weight: 700;
    letter-spacing: -0.02em;
    max-width: calc(100% - 80px);
`;

export const CodeContainer = styled.div`
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.4rem;
    margin: 0 auto;
    width: fit-content;
    border: 2px solid #e9ecef;
`;

export const CodeDisplay = styled.div`
    text-align: center;
    font-size: 2.2rem;
    font-weight: 800;
    letter-spacing: 0.5rem;
    color: #2c3e50;
    font-family: "SF Mono", "Fira Code", monospace;
`;

export const IconsContainer = styled.div`
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1.8rem;
    margin-bottom: 0.5rem;
`;

export const Icon = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: #f8f9fa;
    transition: all 0.2s ease;
    border: 2px solid #e9ecef;

    svg {
        font-size: 1.6rem;
        color: #2c3e50;
    }

    &:hover {
        background: #38a169;
        border-color: #38a169;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(56, 161, 105, 0.2);

        svg {
            color: white;
        }
    }

    &:active {
        transform: translateY(0);
    }
`;

export const Toast = styled.div`
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    border-radius: 12px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    animation: fadeInOut 3s ease;

    @keyframes fadeInOut {
        0% {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        15% {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        85% {
            opacity: 1;
            transform: translate(-50%, 0);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
    }
`;

export const JoinContainer = styled(CreateContainer)`
    &:hover {
        border-color: #4299e1;
        background: #ffffff;
    }

    ${(props) =>
        props.expanded &&
        `
        border: 2px solid #4299e1;
        background: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    `}
`;

export const JoinIcon = styled(PlusIcon)`
    svg {
        color: #4299e1;
    }
`;

export const JoinText = styled(CreateText)`
    color: #4299e1;
`;

export const CodeInput = styled.div`
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1.5rem 0;
`;

export const Digit = styled.input`
    width: 3rem;
    height: 4rem;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: #4299e1;
        background: white;
    }

    &::placeholder {
        color: #cbd5e0;
    }
`;

export const JoinButton = styled(CreateButton)`
    background: ${(props) =>
        props.disabled ? "#e9ecef" : "#4299e1"};

    &:hover:not(:disabled) {
        box-shadow: 0 4px 12px rgba(66, 153, 225, 0.2);
    }
`;

export const JoinHeader = styled(ShareHeader)`
    color: #4299e1;
`;
