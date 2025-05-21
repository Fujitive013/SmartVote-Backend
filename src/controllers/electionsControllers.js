const Election = require("../models/electionModel");
const Vote = require("../models/voteModel");
const mongoose = require("mongoose");

// Create election (Admin only)
const createElection = async (req, res) => {
    try {
        const {
            name,
            city_id,
            baranggay_id,
            description,
            candidates,
            start_date,
            end_date,
        } = req.body;

        if (
            !name ||
            !description ||
            !candidates ||
            !start_date ||
            !end_date ||
            !city_id
        ) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newElection = new Election({
            name,
            city_id,
            baranggay_id,
            description,
            candidates,
            start_date,
            end_date,
        });

        await newElection.save();
        res.status(201).json({
            message: "Election created successfully",
            election: newElection,
        });
    } catch (err) {
        console.error("Error creating election:", err);
        res.status(500).json({ error: "Error creating election" });
    }
};

// Get all elections (Auto-update status)
const getAllElections = async (req, res) => {
    try {
        const elections = await Election.find().populate("candidates._id");

        const updatedElections = elections.map((election) => {
            const now = new Date();
            if (now < election.start_date) {
                election.status = "upcoming";
            } else if (now >= election.start_date && now <= election.end_date) {
                election.status = "ongoing";
            } else {
                election.status = "completed";
            }
            return election;
        });

        res.json(updatedElections);
    } catch (err) {
        console.error("Error fetching elections:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get election by ID
const getElectionById = async (req, res) => {
    try {
        const electionId = req.params.id;
        const election = await Election.findById(electionId).populate(
            "candidates._id"
        );

        if (!election) {
            return res.status(404).json({ error: "Election not found" });
        }

        const now = new Date();
        if (now < election.start_date) {
            election.status = "upcoming";
        } else if (now >= election.start_date && now <= election.end_date) {
            election.status = "ongoing";
        } else {
            election.status = "completed";
        }

        res.json(election);
    } catch (err) {
        console.error("Error fetching election:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Get elections by location
const getElectionsByLocation = async (req, res) => {
    try {
        const { city_id, baranggay_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(city_id)) {
            return res.status(400).json({ message: "Invalid city_id" });
        }

        const cityObjectId = new mongoose.Types.ObjectId(city_id);

        // If barangay is null, return only city-wide elections
        if (!baranggay_id || baranggay_id === "null") {
            const elections = await Election.find({
                city_id: cityObjectId,
                baranggay_id: null,
            }).populate("candidates");

            if (elections.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No city-wide elections found" });
            }

            return res.json(elections);
        }

        if (!mongoose.Types.ObjectId.isValid(baranggay_id)) {
            return res.status(400).json({ message: "Invalid baranggay_id" });
        }

        const baranggayObjectId = new mongoose.Types.ObjectId(baranggay_id);

        // ✅ Modified: Fetch both barangay and city-wide elections
        const elections = await Election.find({
            city_id: cityObjectId,
            $or: [{ baranggay_id: baranggayObjectId }, { baranggay_id: null }],
        }).populate("candidates");

        if (elections.length === 0) {
            return res
                .status(404)
                .json({ message: "No elections found in this location" });
        }

        res.json(elections);
    } catch (err) {
        console.error("Error fetching elections:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// 🆕 Get current election results (added here instead of a new file)
const getCurrentElectionResults = async (req, res) => {
    const { election_id } = req.params;

    try {
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
                $sort: { voteCount: -1 },
            },
        ]);

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
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
    getCurrentElectionResults, // include it in exports
};
