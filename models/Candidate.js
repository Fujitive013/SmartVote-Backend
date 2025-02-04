const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        party: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Candidate", CandidateSchema);
