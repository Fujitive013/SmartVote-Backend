const mongoose = require("mongoose");
const express = require("express");
const Vote = require("../models/Vote");
const User = require("../models/User");
const Election = require("../models/Election");
const router = express.Router();

router.post("/", async (req, res) => {
    const { voter_id, election_id, candidate_id } = req.body;

    try {
        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(voter_id);

        // Find user by ObjectId
        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const election = await Election.findById(election_id);
        if (!election)
            return res.status(404).json({ error: "Election not found" });

        if (user.voted_elections.includes(election_id)) {
            return res
                .status(400)
                .json({ error: "User has already voted in this election" });
        }

        // Create the vote
        const newVote = new Vote({ voter_id, election_id, candidate_id });
        await newVote.save();

        // Update user's voted elections list
        await User.findByIdAndUpdate(voter_id, {
            $push: { voted_elections: election_id },
        });

        res.status(201).json({ message: "Vote cast successfully" });
    } catch (err) {
        console.error("Error casting vote:", err);
        res.status(500).json({ error: "Error casting vote" });
    }
});

module.exports = router;
