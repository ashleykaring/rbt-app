const API_BASE_URL = "http://localhost:8000/api";

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
        return {
            success: response.ok,
            message: data.message
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

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Server error response:", errorData);
            return {
                success: false,
                message: errorData.message
            };
        }

        const data = await response.json();
        if (data.userId) {
            localStorage.setItem("userId", data.userId);
        }
        console.log("Login response:", {
            status: response.status,
            success: response.ok,
            message: data.message
        });

        return {
            success: true,
            message: data.message,
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
