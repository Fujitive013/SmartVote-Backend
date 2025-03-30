const City = require("../models/cityModel");

const fetchCities = async (req, res) => {
    try {
        const city_id = req.params.id;
        if (!city_id) {
            return res.status(400).json({ error: "City ID is required" });
        }
        const cities = await City.findById(city_id).populate("baranggays._id");
        res.status(200).json(cities);
    } catch (err) {
        console.error("Error fetching cities:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = fetchCities;
