const Election = require("../models/electionModel");
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

        // Validate required fields
        if (
            !name ||
            !description ||
            !candidates ||
            !start_date ||
            !end_date ||
            !city_id ||
            !baranggay_id
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

        // Auto-update election status before sending response
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

// Get election details by ID
const getElectionById = async (req, res) => {
    try {
        const election = await Election.findById(req.params.id).populate(
            "candidates._id"
        );

        if (!election) {
            return res.status(404).json({ error: "Election not found" });
        }

        // Auto-update status before sending response
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

const getElectionsByLocation = async (req, res) => {
    try {
        let { city_id, baranggay_id: baranggay_id } = req.params; // Get IDs from URL params

        if (!city_id || !baranggay_id) {
            return res
                .status(400)
                .json({ error: "City ID and Barangay ID are required" });
        }

        // Convert to ObjectId if valid
        if (mongoose.Types.ObjectId.isValid(city_id)) {
            city_id = new mongoose.Types.ObjectId(city_id);
        }
        if (mongoose.Types.ObjectId.isValid(baranggay_id)) {
            baranggay_id = new mongoose.Types.ObjectId(baranggay_id);
        }

        console.log("City ID:", city_id);
        console.log("Barangay ID:", baranggay_id);

        // Find elections by location
        const elections = await Election.find({
            city_id,
            baranggay_id: baranggay_id,
        }).populate("candidates._id");

        console.log("Found Elections:", elections);

        if (elections.length === 0) {
            return res
                .status(404)
                .json({ message: "No elections found for this location" });
        }

        res.json(elections);
    } catch (err) {
        console.error("Error fetching elections:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
};
