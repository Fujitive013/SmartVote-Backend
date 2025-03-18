const mongoose = require("mongoose");
const CandidateSchema = require("../schemas/CandidateSchema");

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;
