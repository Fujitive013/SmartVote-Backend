const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["voter", "admin"], default: "voter" },
        voted_elections: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
        ],
        city_id: { type: mongoose.Schema.Types.ObjectId, required: true },
        baranggay_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = UserSchema;
