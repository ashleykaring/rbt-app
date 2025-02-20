import jwt from "jsonwebtoken";

// Create JWT token
export const createToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Token expires in 7 days
    );
};

// Set JWT cookie
export const setTokenCookie = (res, token) => {
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true, // Always use HTTPS for Azure
        sameSite: "none", // Required for cross-origin
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        domain: "rosebudthorn.azurewebsites.net"
    });
};
