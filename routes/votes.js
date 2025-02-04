const mongoose = require("mongoose");
const express = require("express");
const Vote = require("../models/Vote");
const User = require("../models/User");
const Election = require("../models/Election");

const router = express.Router();

// Cast a vote
router.post("/", async (req, res) => {
    const {
        voter_id,
        voter_first_name,
        voter_last_name,
        election_id,
        election_name,   
        candidate_id,
        candidate_name,
    } = req.body;

    try {
        // Check if the user has already voted in this election
        const user = await User.findById(voter_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.voted_elections.includes(election_id)) {
            return res
                .status(400)
                .json({ error: "You have already voted in this election" });
        }

        // Create a new vote record
        const newVote = new Vote({
            voter_id,
            voter_first_name,
            voter_last_name,
            election_id,
            election_name,    
            candidate_id,
            candidate_name,
        });

        // Save the vote and update the user's voted_elections
        await newVote.save();
        user.voted_elections.push(election_id);
        await user.save();

        res.status(201).json({ message: "Vote submitted successfully" });
    } catch (err) {
        console.error("Error creating vote:", err);
        if (err.name === "ValidationError") {
            return res.status(400).json({ error: err.message });
        }
        res.status(500).json({ error: "Error submitting vote" });
    }
});

// Check if a user has voted in a specific election
router.get("/check", async (req, res) => {
    const { voter_id, election_id } = req.query;

    try {
        const user = await User.findById(voter_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const hasVoted = user.voted_elections.includes(election_id);
        res.status(200).json({ hasVoted });
    } catch (err) {
        console.error("Error checking vote:", err);
        res.status(500).json({ error: "Error checking vote" });
    }
});

// Count total votes for a specific candidate
router.get("/count/:candidate_id", async (req, res) => {
    const { candidate_id } = req.params;

    try {
        const voteCount = await Vote.countDocuments({ candidate_id });
        res.status(200).json({ candidate_id, voteCount });
    } catch (err) {
        console.error("Error counting votes:", err);
        res.status(500).json({ error: "Error counting votes" });
    }
});

module.exports = router;
