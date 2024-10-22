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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(
        -45deg,
        #ee7752,
        #e73c7e,
        #23a6d5,
        #23d5ab
    );
    background-size: 400% 400%;
    animation: ${gradientAnimation} 15s ease infinite;
    padding: 20px;
`;

export const FormContainer = styled.div`
    background-color: rgba(255, 255, 255, 0.9);
    padding: 40px 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Logo = styled.div`
    width: 100px;
    height: 100px;
    margin: 0 auto 20px;
    background-color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #333;
`;

export const Title = styled.h2`
    color: #333;
    font-size: 28px;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
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
`;
