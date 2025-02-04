const ResultSchema = new mongoose.Schema({
    election_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Election",
        required: true,
    },
    results: [
        {
            candidate_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Candidate",
                required: true,
            },
            votes: { type: Number, default: 0 },
        },
    ],
    winner: {
        candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidate",
        },
        name: { type: String },
    },
    finalized: { type: Boolean, default: false },
});

module.exports = mongoose.model("Result", ResultSchema);
