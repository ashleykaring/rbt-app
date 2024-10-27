/*
IMPORTS
*/

// Libraries
import styled, { keyframes } from "styled-components";

// Animation constants
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

/*
STYLES 
*/

export const AccountContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 0 20px;
    background: linear-gradient(
        -45deg,
        #f5d8da,
        #de7792,
        #879e84,
        #2d5441
    );
    background-size: 400% 400%;
    animation: ${gradientAnimation} 15s ease infinite;

    @media (max-width: 480px) {
        padding: 0 10px;
    }
`;

export const FormContainer = styled.div`
    background-color: rgba(255, 255, 255, 0.9);
    padding: 95px 30px 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    margin: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    @media (max-width: 480px) {
        padding: 75px 24px 32px;
        border-radius: 15px;
        margin: 15px;
    }
`;

export const LogoImage = styled.img`
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    background-color: white;
    padding: 10px;
    z-index: 1;

    @media (max-width: 480px) {
        width: 120px;
        height: 120px;
        padding: 8px;
    }
`;

export const Title = styled.h2`
    color: #333;
    font-size: 32px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 800;
    margin-top: 15px;

    @media (max-width: 480px) {
        font-size: 24px;
        margin-bottom: 25px;
        margin-top: 10px;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const InputGroup = styled.div`
    margin-bottom: 25px;
    position: relative;
    width: 100%;

    @media (max-width: 480px) {
        margin-bottom: 20px;
    }
`;

export const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    width: 100%;

    @media (max-width: 480px) {
        font-size: 12px;
        margin-bottom: 6px;
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;

    &:focus {
        border-color: #23a6d5;
        box-shadow: 0 0 0 3px rgba(35, 166, 213, 0.1);
        outline: none;
    }

    @media (max-width: 480px) {
        padding: 10px 12px;
        font-size: 14px;
        border-radius: 6px;
    }
`;

export const PasswordStrengthContainer = styled.div`
    margin-top: 10px;
    height: 6px;
    background-color: #eee;
    border-radius: 3px;
    overflow: hidden;
`;

export const PasswordStrengthBar = styled.div`
    height: 100%;
    transition: width 0.3s, background-color 0.3s;
`;

export const Button = styled.button`
    background-color: #23a6d5;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
    width: 100%;

    &:hover {
        background-color: #1c8ab1;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    @media (max-width: 480px) {
        padding: 12px;
        font-size: 14px;
        border-radius: 6px;
    }

    @media (hover: none) {
        &:hover {
            transform: none;
        }
    }
`;

export const LinkText = styled.p`
    text-align: center;
    margin-top: 25px;
    font-size: 14px;
    color: #555;

    a {
        color: #23a6d5;
        text-decoration: none;
        font-weight: 600;

        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 480px) {
        font-size: 13px;
        margin-top: 20px;
    }
`;

// Add these exports at the end of the file

export const AlertOverlay = styled.div`
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-left: 4px solid #ff4d4d;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slideDown 0.3s ease-out;

    @keyframes slideDown {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
`;

export const AlertText = styled.span`
    color: #333;
    font-size: 14px;
    font-weight: 500;
`;
