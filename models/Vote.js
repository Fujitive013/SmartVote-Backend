const mongoose = require("mongoose"); 
const VoteSchema = new mongoose.Schema({
    voter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    election_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true,
    },
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vote", VoteSchema);
