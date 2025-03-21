const mongoose = require("mongoose");

const BarangaySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Auto-generate ObjectId for each barangay
    },
    name: {
        type: String,
        required: true,
    },
});

const CitySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Auto-generate ObjectId for the city
    },
    name: {
        type: String,
        required: true,
    },
    barangays: [BarangaySchema], // Array of embedded barangay objects
});

module.exports = CitySchema;
