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
    LinkText
} from "./login.styles";

/*
Components & Render
*/
function Login({ setIsLoggedIn }) {
    // Constants
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    // Make sure email & password fields aren't empty
    useEffect(() => {
        setIsFormValid(
            email.trim() !== "" && password.trim() !== ""
        );
    }, [email, password]);

    // Future submit logic
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormValid) {
            // Add your login logic here
            console.log("Login attempt:", { email, password });
            setIsLoggedIn(true);
        }
    };

    // Render component
    return (
        <AccountContainer>
            <FormContainer>
                <Title>Welcome Back</Title>
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
