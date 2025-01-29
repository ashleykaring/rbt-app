const getApiBaseUrl = () => {
    if (window.location.hostname.includes('ngrok')) {
        // When using ngrok, API calls will go to /api/* on the same domain
        return '';  // Empty string means use relative paths
    }
    return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();