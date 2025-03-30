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
        const electionId = req.params.id;
        const election = await Election.findById(electionId).populate(
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
        const { city_id, baranggay_id } = req.params; // Extract parameters

        // Validate city_id
        if (!mongoose.Types.ObjectId.isValid(city_id)) {
            return res.status(400).json({ message: "Invalid city_id" });
        }
        const cityObjectId = new mongoose.Types.ObjectId(city_id);

        // Check if baranggay_id is missing
        if (!baranggay_id || baranggay_id === "null") {
            // Find city-wide elections (where baranggay_id is null)
            const elections = await Election.find({
                city_id: cityObjectId,
                baranggay_id: null,
            }).populate("candidates");

            console.log("Found City Elections:", elections);

            if (elections.length === 0) {
                return res
                    .status(404)
                    .json({ message: "No city-wide elections found" });
            }

            return res.json(elections);
        }

        // If baranggay_id is provided, validate it
        if (!mongoose.Types.ObjectId.isValid(baranggay_id)) {
            return res.status(400).json({ message: "Invalid baranggay_id" });
        }
        const baranggayObjectId = new mongoose.Types.ObjectId(baranggay_id);

        console.log("Fetching barangay-specific elections...");

        // Find barangay-specific elections
        const elections = await Election.find({
            city_id: cityObjectId,
            baranggay_id: baranggayObjectId,
        }).populate("candidates");

        console.log("Found Barangay Elections:", elections);

        if (elections.length === 0) {
            return res
                .status(404)
                .json({ message: "No barangay elections found" });
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
