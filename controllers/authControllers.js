const User = require("../models/User");
const { hashPassword, comparePassword } = require("../utils/authUtils");

const registerUser = async (req, res) => {
    console.log("Request Body:", req.body);
    const { first_name, last_name, email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email and Password are required" });
    }

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
            voted_elections: [],
            created_at: new Date(),
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
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Use comparePassword from authUtils
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                first_name: user.first_name,
                last_name: user.last_name,
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: "Error logging in." });
    }
};

module.exports = { registerUser, loginUser };
