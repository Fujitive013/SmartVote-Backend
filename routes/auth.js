const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging line
    const { first_name, last_name, email, password } = req.body;
    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: "voter",
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
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
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
});

module.exports = router;
