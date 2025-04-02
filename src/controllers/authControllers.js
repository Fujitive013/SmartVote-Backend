const User = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/authUtils");
const { generateToken } = require("../utils/jwtUtils");

const registerUser = async (req, res) => {
    console.log("Request Body:", req.body);
    const { first_name, last_name, email, password, city_id, baranggay_id } =
        req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Use hashPassword from authUtils
        const hashedPassword = await hashPassword(password.trim());

        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: "voter", // Default role is "voter"
            voted_elections: [], // refetch this after voting
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

        const token = generateToken(user);
        res.status(200).json({
            message: "Login successful",
            token: `Bearer ${token}`,
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

module.exports = { registerUser, loginUser };
