const API_BASE_URL = "http://localhost:8000/api";

// CHECK IF USER EXISTS
export const checkIfUserExists = async (email) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/user-exists/${email}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            }
        );

        const data = await response.json();
        console.log("Check user exists response:", data);

        if (response.ok) {
            return {
                exists: data.exists,
                firstName: data.firstName
            };
        } else {
            return {
                exists: false,
                message:
                    data.message ||
                    "Failed to check user existence"
            };
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        return {
            exists: false,
            message:
                "Unable to connect to the server. Please check your connection and try again."
        };
    }
};

// REGISTER USER
export const registerUser = async (userData) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(userData)
            }
        );

        const data = await response.json();
        console.log("Register response:", data);

        if (response.ok && data.userId) {
            localStorage.setItem("userId", data.userId);
            console.log(
                "Stored userId in localStorage after registration:",
                data.userId
            );
            return {
                success: true,
                userId: data.userId
            };
        }

        return {
            success: false,
            message: data.message || "Registration failed"
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message:
                "Unable to connect to the server. Please check your connection and try again."
        };
    }
};

// LOGIN USER
export const loginUser = async (credentials) => {
    console.log("Attempting to login user:", {
        email: credentials.email
    });

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            console.log("Server error response:", data);
            return {
                success: false,
                message: data.message || "Login failed"
            };
        }

        if (!data.userId) {
            console.error(
                "No userId received in login response"
            );
            return {
                success: false,
                message: "Server error: No user ID received"
            };
        }

        // Store the userId in localStorage
        localStorage.setItem("userId", data.userId);
        console.log(
            "Stored userId in localStorage:",
            data.userId
        );

        return {
            success: true,
            message: "Login successful",
            userId: data.userId
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "Error logging you in. Please try again."
        };
    }
};
