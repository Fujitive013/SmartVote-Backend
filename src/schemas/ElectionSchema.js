const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        city_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        baranggay_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        description: { type: String, required: true, trim: true },

        candidates: [
            {
                name: { type: String, required: true },
                party: { type: String, required: true },
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
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

ElectionSchema.pre("save", function (next) {
    const now = new Date();
    if (now < this.start_date) {
        this.status = "upcoming";
    } else if (now >= this.start_date && now <= this.end_date) {
        this.status = "ongoing";
    } else {
        this.status = "completed";
    }
    next();
});

module.exports = ElectionSchema;
