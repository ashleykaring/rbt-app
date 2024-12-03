export const getCurrentUserId = async () => {
    try {
        const response = await fetch(
            "http://localhost:8000/api/user/current",
            {
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.userId;
    } catch (error) {
        console.error("Error getting current user:", error);
        return null;
    }
};
