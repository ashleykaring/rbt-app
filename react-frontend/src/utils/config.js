// This file is just something I am using to be able to run the app on my phone for PWA and sizing testing

const getApiBaseUrl = () => {
    if (window.location.hostname.includes("ngrok")) {
        // When using ngrok, API calls will go to /api/* on the same domain
        return ""; // Empty string means use relative paths
    }
    return "https://rosebudthorn.azurewebsites.net";
};

export const API_BASE_URL = getApiBaseUrl();
