const mongoose = require("mongoose");

const baranggaySchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Auto-generate ObjectId for each baranggay
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
    baranggays: [baranggaySchema], // Array of embedded baranggay objects
});

module.exports = CitySchema;
