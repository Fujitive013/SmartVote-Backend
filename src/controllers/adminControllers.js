const User = require("../models/userModel"); // Adjust path as needed

// Get all users with selected fields
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(
            {},
            "first_name last_name baranggay_id city_id"
        );
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Server error fetching users" });
    }
};

module.exports = {
    getAllUsers,
    // ... other exports
};
