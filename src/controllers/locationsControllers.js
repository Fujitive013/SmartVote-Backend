const City = require("../models/cityModel");

const fetchCities = async (req, res) => {
    try {
        const cities = await City.find(); // Fetch all cities
        res.status(200).json(cities); // Correct way to send JSON response with status 200
    } catch (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = fetchCities;
