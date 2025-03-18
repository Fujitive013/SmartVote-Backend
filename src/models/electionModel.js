const mongoose = require("mongoose");
const ElectionSchema = require("../schemas/ElectionSchema");

const Election = mongoose.model("Election", ElectionSchema);

module.exports = Election;
