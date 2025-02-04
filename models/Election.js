const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },

        candidates: [
            {
                candidate: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Candidate", // ✅ Reference the Candidate model correctly
                    required: true,
                },
            },
        ],

        start_date: { type: Date, required: true, index: true },
        end_date: { type: Date, required: true, index: true },

        status: {
            type: String,
            enum: ["upcoming", "ongoing", "completed"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Election", ElectionSchema);
