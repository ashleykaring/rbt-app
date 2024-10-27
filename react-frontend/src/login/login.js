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
    Title,
    Form,
    InputGroup,
    Label,
    Input,
    Button,
    LinkText,
    LogoImage,
    AlertOverlay,
    AlertText
} from "./login.styles";

// Images
import RBDLogo from "./RBDLogo.png";

// Add to imports section
import { loginUser } from "./authService";

/*
Components & Render
*/
function Login({ setIsLoggedIn }) {
    // Constants
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    // Make sure email & password fields aren't empty
    useEffect(() => {
        setIsFormValid(
            email.trim() !== "" && password.trim() !== ""
        );
    }, [email, password]);

    // Future submit logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submission initiated");

        if (isFormValid) {
            console.log(
                "Form validation passed, preparing login data"
            );
            const credentials = {
                email,
                password
            };

            console.log("Calling loginUser with email:", email);
            const result = await loginUser(credentials);
            console.log("Login result:", result);

            if (!result.success) {
                setStatusMessage(result.message);
                // Clear error message after 3 seconds
                setTimeout(() => setStatusMessage(""), 3000);
            } else {
                console.log(
                    "Login successful, preparing to redirect"
                );
                setIsLoggedIn(true);
            }
        } else {
            console.log("Form validation failed");
        }
    };

    // Render component
    return (
        <AccountContainer>
            <FormContainer>
                <LogoImage src={RBDLogo} alt="RBD Logo" />
                <Title>Welcome Back!</Title>
                <Form onSubmit={handleSubmit}>
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
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </InputGroup>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={!isFormValid}
                    >
                        Sign In
                    </Button>

                    {statusMessage && (
                        <AlertOverlay>
                            <AlertText>
                                {statusMessage}
                            </AlertText>
                        </AlertOverlay>
                    )}
                </Form>

                {/* Switch to Creating New Account */}
                <LinkText>
                    New to our community?{" "}
                    <Link to="/create-account">
                        Create an account
                    </Link>
                </LinkText>
            </FormContainer>
        </AccountContainer>
    );
}

// Future use in main app flow
export default Login;
