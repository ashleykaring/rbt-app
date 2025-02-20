const API_BASE_URL =
    "https://rosebudthorn.azurewebsites.net/api";

// Utility function for API calls
const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers
        },
        credentials: "include",
        ...options
    });
    return response;
};

// CHECK IF USER EXISTS
export const checkIfUserExists = async (email) => {
    try {
        const response = await apiCall(
            `/user-exists/${email}`,
            {
                method: "GET"
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
        const response = await apiCall("/register", {
            method: "POST",
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Registration failed"
            };
        }

        return {
            success: true,
            message: "Registration successful"
        };
    } catch (error) {
        console.error("Registration error:", error);
        return {
            success: false,
            message:
                "Unable to connect to the server. Please try again."
        };
    }
};

// LOGIN USER
export const loginUser = async (credentials) => {
    try {
        const response = await apiCall("/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Login failed"
            };
        }

        return {
            success: true,
            message: "Login successful"
        };
    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "Error logging you in. Please try again."
        };
    }
};
