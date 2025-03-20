const ResultSchema = new mongoose.Schema({
    election_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    results: [
        {
            candidate_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            votes: { type: Number, default: 0 },
        },
    ],
    winner: {
        candidate_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        name: { type: String },
    },
    finalized: { type: Boolean, default: false },
});

module.exports = ResultSchema;
