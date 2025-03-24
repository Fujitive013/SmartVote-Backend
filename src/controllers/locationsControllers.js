const City = require("../models/cityModel");

const fetchCities = async (req, res) => {
    try {
        const cities = await City.find();
        res.status(200).json(cities);
    } catch (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = fetchCities;
