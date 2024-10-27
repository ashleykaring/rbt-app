const API_BASE_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
    console.log("Attempting to register user:", {
        email: userData.email,
        first_name: userData.first_name
    });

    try {
        const response = await fetch(
            `${API_BASE_URL}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.log("Server error response:", errorData);
            return {
                success: false,
                message: errorData.message
            };
        }

        const data = await response.json();
        console.log("Registration response:", {
            status: response.status,
            success: response.ok,
            message: data.message
        });

        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message:
                "There was an error registering, please try again."
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
        console.log("Login response:", {
            status: response.status,
            success: response.ok,
            message: data.message
        });

        return {
            success: true,
            message: data.message
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "Error logging you in. Please try again."
        };
    }
};
