const Election = require("../models/electionModel");

// Middleware: Ensure user is admin (For now, assume role is sent in request)
const isAdmin = (req, res, next) => {
    if (req.body.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};

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

module.exports = { isAdmin, createElection, getAllElections, getElectionById };
