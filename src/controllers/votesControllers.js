const Vote = require("../models/voteModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { emitElectionUpdate } = require("../libs/socket");

// Cast a vote
const castVote = async (req, res) => {
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
        const user = await User.findById(voter_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.voted_elections.includes(election_id)) {
            return res
                .status(400)
                .json({ error: "You have already voted in this election" });
        }

        const newVote = new Vote({
            voter_id,
            voter_first_name,
            voter_last_name,
            election_id,
            election_name,
            candidate_id,
            candidate_name,
        });

        user.voted_elections.push(election_id);

        await newVote.save();
        await user.save();

        // Get updated results
        const results = await Vote.aggregate([
            {
                $match: {
                    election_id: new mongoose.Types.ObjectId(election_id),
                },
            },
            {
                $group: {
                    _id: "$candidate_id",
                    candidateName: { $first: "$candidate_name" },
                    voteCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    candidate_id: "$_id",
                    candidateName: 1,
                    voteCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { voteCount: -1 },
            },
        ]);

        // Calculate total votes
        const totalVotes = results.reduce(
            (sum, curr) => sum + curr.voteCount,
            0
        );

        // Emit updated results with consistent format
        emitElectionUpdate(election_id, {
            electionId: election_id,
            totalVotes,
            results,
        });

        res.status(201).json({ message: "Vote submitted successfully" });
    } catch (err) {
        console.error("Error creating vote:", err);
        res.status(500).json({ error: "Error submitting vote" });
    }
};

// Check if a user has voted in a specific election
const checkVote = async (req, res) => {
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
};

// Check voting status and get vote details
const getVoteStatus = async (req, res) => {
    const { voter_id, election_id } = req.query;

    try {
        const vote = await Vote.findOne({ voter_id, election_id });
        if (!vote) {
            return res.status(200).json({
                hasVoted: false,
                message: "User has not voted in this election.",
            });
        }

        res.status(200).json({
            hasVoted: true,
            voteDetails: {
                candidate_id: vote.candidate_id,
                candidate_name: vote.candidate_name,
                election_id: vote.election_id,
                election_name: vote.election_name,
                dateVoted: vote.createdAt,
            },
        });
    } catch (err) {
        console.error("Error retrieving voting status:", err);
        res.status(500).json({ error: "Error retrieving voting status" });
    }
};

// Count total votes for a specific candidate
const countVotes = async (req, res) => {
    const { candidate_id } = req.params;

    try {
        const voteCount = await Vote.countDocuments({ candidate_id });
        res.status(200).json({ candidate_id, voteCount });
    } catch (err) {
        console.error("Error counting votes:", err);
        res.status(500).json({ error: "Error counting votes" });
    }
};

// Get real-time election results
const getCurrentElectionResults = async (req, res) => {
    const { election_id } = req.params;

    try {
        // Validate election_id
        if (!mongoose.Types.ObjectId.isValid(election_id)) {
            return res
                .status(400)
                .json({ error: "Invalid election ID format" });
        }

        const results = await Vote.aggregate([
            {
                $match: {
                    election_id: new mongoose.Types.ObjectId(election_id),
                },
            },
            {
                $group: {
                    _id: "$candidate_id",
                    candidateName: { $first: "$candidate_name" },
                    voteCount: { $sum: 1 },
                },
            },
            {
                $project: {
                    candidate_id: "$_id",
                    candidateName: 1,
                    voteCount: 1,
                    _id: 0,
                },
            },
            {
                $sort: { voteCount: -1 }, // Sort by vote count in descending order
            },
        ]);

        // If no results found
        if (!results || results.length === 0) {
            return res.status(200).json({
                message: "No votes recorded for this election yet",
                results: [],
            });
        }

        res.status(200).json({
            electionId: election_id,
            totalVotes: results.reduce((sum, curr) => sum + curr.voteCount, 0),
            results,
        });
    } catch (err) {
        console.error("Error fetching election results:", err);
        res.status(500).json({
            error: "Error fetching results",
            details: err.message,
        });
    }
};

module.exports = {
    castVote,
    checkVote,
    getVoteStatus,
    countVotes,
    getCurrentElectionResults,
};
