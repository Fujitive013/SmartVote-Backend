const jwt = require("jsonwebtoken");

const generateToken = (user) => {
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

const decodeToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        return decoded;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
};

module.exports = { generateToken, decodeToken };
