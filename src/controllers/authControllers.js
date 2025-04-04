const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/authUtils");
const {
    generateAccessToken,
    generateRefreshToken,
    decodeToken,
} = require("../utils/jwtUtils");

const registerUser = async (req, res) => {
    console.log("Request Body:", req.body);
    const { first_name, last_name, email, password, city_id, baranggay_id } =
        req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }
        const hashedPassword = await hashPassword(password.trim());
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: "voter",
            voted_elections: [],
            city_id,
            baranggay_id,
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Error creating user:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error creating user." });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        // Store the refresh token directly in the database
        user.refresh_token = refreshToken;
        await user.save();

        res.status(200).json({
            message: "Login successful",
            token: `Bearer ${accessToken}`,
            refresh_token: refreshToken,
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                id: user._id,
                email: user.email,
                role: user.role,
                city_id: user.city_id,
                baranggay_id: user.baranggay_id,
                voted_elections: user.voted_elections,
            },
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Error logging in." });
    }
};

const logoutUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        user.refresh_token = null;
        await user.save();

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).json({ error: "Error logging out." });
    }
};

const newToken = async (req, res) => {
    const { refresh_token } = req.body;

    if (!refresh_token) {
        return res.status(400).json({ error: "Refresh token is required" });
    }

    try {
        const decoded = decodeToken(refresh_token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const user = await User.findById(decoded.id);
        if (!user || user.refresh_token !== refresh_token) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            message: "Access token refreshed successfully",
            access_token: `Bearer ${newAccessToken}`,
        });
    } catch (err) {
        if (err.name === "TokenExpiredError" || err.message === "jwt expired") {
            return res.status(401).json({ error: "Refresh token has expired" });
        }
        console.error("Error generating new token:", err);
        res.status(500).json({ error: "Error generating new token." });
    }
};

module.exports = { registerUser, loginUser, logoutUser, newToken };
