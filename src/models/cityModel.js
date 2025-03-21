const mongoose = require("mongoose");
const CitySchema = require("../schemas/CitySchema");

const City = mongoose.model("City", CitySchema);
module.exports = City;
