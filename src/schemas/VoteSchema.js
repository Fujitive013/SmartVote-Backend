const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema(
    {
        voter_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        voter_first_name: {
            type: String,
            required: true,
        },
        voter_last_name: {
            type: String,
            required: true,
        },
        election_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        election_name: {
            type: String,
            required: true,
        },
        candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        candidate_name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = VoteSchema;
