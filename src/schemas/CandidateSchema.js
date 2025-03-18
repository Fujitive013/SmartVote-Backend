const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        party: { type: String, required: true, trim: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = CandidateSchema;
