const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["voter", "admin"], default: "voter" },
    voted_elections: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
    ],
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
