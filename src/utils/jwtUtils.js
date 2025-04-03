const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            city_id: user.city_id,
            baranggay_id: user.baranggay_id,
            voted_elections: user.voted_elections,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            city_id: user.city_id,
            baranggay_id: user.baranggay_id,
            voted_elections: user.voted_elections,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifies and decodes the token
        console.log("Decoded token:", decoded);
        return decoded;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.error("Token has expired:", error.message);
            throw new Error("TokenExpiredError");
        } else if (error.name === "JsonWebTokenError") {
            console.error("Invalid token:", error.message);
            throw new Error("InvalidTokenError");
        } else {
            console.error("Error decoding token:", error.message);
            throw new Error("TokenDecodeError");
        }
    }
};

module.exports = { generateAccessToken, generateRefreshToken, decodeToken };
