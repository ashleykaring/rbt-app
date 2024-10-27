/*
IMPORTS
*/

// Libraries
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Styles
import {
    AccountContainer,
    FormContainer,
    Logo,
    Title,
    Form,
    InputGroup,
    Label,
    Input,
    PasswordStrengthContainer,
    PasswordStrengthBar,
    Button,
    LinkText
} from "./login.styles";

/*
COMPONENTS & RENDER
*/
function CreateAccount({ setIsLoggedIn }) {
    // Constants
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isFormValid, setIsFormValid] = useState(false);

    // Update strength indicator on input change
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(
            calculatePasswordStrength(newPassword)
        );
    };

    // Logic for what makes a password strong
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/))
            strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    // Make sure al forms are filled in
    useEffect(() => {
        setIsFormValid(
            firstName.trim() !== "" &&
                email.trim() !== "" &&
                password.trim() !== "" &&
                passwordStrength >= 3
        );
    }, [firstName, email, password, passwordStrength]);

    // Future development for submit button
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            // Add your account creation logic here
            console.log("Account created:", {
                firstName,
                email,
                password
            });
            setIsLoggedIn(true);
        }
    };

    // Colors for password strength bar
    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 1:
                return "#ff4d4d";
            case 2:
                return "#ffa500";
            case 3:
                return "#2ecc71";
            case 4:
                return "#27ae60";
            default:
                return "#eee";
        }
    };

    // Add a function to get the glow effect
    const getPasswordStrengthGlow = () => {
        return passwordStrength === 4
            ? "0 0 10px #27ae60, 0 0 20px #27ae60"
            : "none";
    };

    // Add a new function to get the password improvement message
    const getPasswordImprovementMessage = () => {
        const messages = [];
        if (password.length < 8)
            messages.push("at least 8 characters");
        if (
            !password.match(/[a-z]/) ||
            !password.match(/[A-Z]/)
        )
            messages.push("both cases");
        if (!password.match(/\d/)) messages.push("a number");
        if (!password.match(/[^a-zA-Z\d]/))
            messages.push("a special character");
        return messages.length > 0
            ? `Add ${messages.join(", ")}`
            : "";
    };

    // Render
    return (
        <AccountContainer>
            <FormContainer>
                {/* Title & Logo */}
                <Logo>RBT</Logo>
                <Title>Join the Reflection Revolution</Title>
                <Form onSubmit={handleSubmit}>
                    {/* First Name Input Field */}
                    <InputGroup>
                        <Label htmlFor="firstName">
                            Your Name
                        </Label>
                        <Input
                            type="text"
                            id="firstName"
                            placeholder="Enter your first name"
                            value={firstName}
                            onChange={(e) =>
                                setFirstName(e.target.value)
                            }
                            required
                        />
                    </InputGroup>

                    {/* Email Input Field */}
                    <InputGroup>
                        <Label htmlFor="email">
                            Email Address
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </InputGroup>

                    {/* Password Input Field */}
                    <InputGroup>
                        <Label htmlFor="password">
                            Secure Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <PasswordStrengthContainer>
                            <PasswordStrengthBar
                                style={{
                                    width: `${
                                        passwordStrength * 25
                                    }%`,
                                    backgroundColor:
                                        getPasswordStrengthColor(),
                                    boxShadow:
                                        getPasswordStrengthGlow()
                                }}
                            />
                        </PasswordStrengthContainer>
                        <small
                            style={{
                                color: "#555",
                                marginTop: "5px",
                                display: "block"
                            }}
                        >
                            {getPasswordImprovementMessage()}
                        </small>
                    </InputGroup>

                    {/* Submit button */}
                    <Button
                        type="submit"
                        disabled={!isFormValid}
                    >
                        Start Your Journey
                    </Button>
                </Form>
                <LinkText>
                    Already on the path?{" "}
                    <Link to="/login">Sign in</Link>
                </LinkText>
            </FormContainer>
        </AccountContainer>
    );
}

// Export to use in login flow
export default CreateAccount;
