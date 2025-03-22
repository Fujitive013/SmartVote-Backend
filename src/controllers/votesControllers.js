const Vote = require("../models/voteModel");
const User = require("../models/userModel");

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
    barangay_id,
    city_id
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
      barangay_id,
      city_id
    });

    user.voted_elections.push(election_id);

    await newVote.save();

    await user.save();

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

// Fetch all votes for a specific user, filtered by barangay_id and city_id
const getUserVotes = async (req, res) => {
  const { voter_id, barangay_id, city_id } = req.query;

  try {
    // First approach: Get the user with voted_elections
    const user = await User.findById(voter_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user has voted_elections array, we can use it directly
    if (user.voted_elections && user.voted_elections.length > 0) {
      // Get the actual vote details for each election ID
      const votes = await Vote.find({
        voter_id,
        election_id: { $in: user.voted_elections },
      });

      return res.status(200).json({
        votes,
        voted_elections: user.voted_elections,
      });
    }

    // Fallback: Fetch all votes for the user
    const votes = await Vote.find({ voter_id });

    // Filter votes if barangay_id and city_id fields exist in the vote model
    let filteredVotes = votes;
    if (barangay_id && city_id) {
      filteredVotes = votes.filter((vote) => {
        // Check if vote has these fields, otherwise return true to include all votes
        if (!vote.barangay_id || !vote.city_id) return true;
        return (
          vote.barangay_id.toString() === barangay_id.toString() &&
          vote.city_id.toString() === city_id.toString()
        );
      });
    }

    res.status(200).json({
      votes: filteredVotes,
      voted_elections: votes.map((vote) => vote.election_id),
    });
  } catch (err) {
    console.error("Error fetching user votes:", err);
    res
      .status(500)
      .json({ error: "Error fetching user votes", details: err.message });
  }
};

module.exports = {
  castVote,
  checkVote,
  getVoteStatus,
  countVotes,
  getUserVotes,
};
