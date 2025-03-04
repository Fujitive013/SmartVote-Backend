const Vote = require("../models/voteModel");
const User = require("../models/userModel");

// Cast a vote
exports.castVote = async (req, res) => {
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

        await newVote.save();
        user.voted_elections.push(election_id);
        await user.save();

        res.status(201).json({ message: "Vote submitted successfully" });
    } catch (err) {
        console.error("Error creating vote:", err);
        res.status(500).json({ error: "Error submitting vote" });
    }
};

// Check if a user has voted in a specific election
exports.checkVote = async (req, res) => {
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
exports.getVoteStatus = async (req, res) => {
    const { voter_id, election_id } = req.query;

    try {
        const vote = await Vote.findOne({ voter_id, election_id });
        if (!vote) {
            return res
                .status(200)
                .json({
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
exports.countVotes = async (req, res) => {
    const { candidate_id } = req.params;

    try {
        const voteCount = await Vote.countDocuments({ candidate_id });
        res.status(200).json({ candidate_id, voteCount });
    } catch (err) {
        console.error("Error counting votes:", err);
        res.status(500).json({ error: "Error counting votes" });
    }
};
