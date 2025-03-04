const mongoose = require("mongoose");
const CandidateSchema = require("./schemas/CandidateSchema");

module.exports = mongoose.model("Candidate", CandidateSchema);
