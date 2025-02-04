const express = require("express");
const Election = require("../models/Election");
const router = express.Router();

// Create election (Admin only)
router.post("/", async (req, res) => {
    try {
        const newElection = new Election(req.body);
        await newElection.save();
        res.status(201).json({ message: "Election created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error creating election" });
    }
});

// Get all elections
router.get("/", async (req, res) => {
    try {
        const elections = await Election.find();
        res.json(elections);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get election details
router.get("/:id", async (req, res) => {
    try {
        const election = await Election.findById(req.params.id);
        if (!election)
            return res.status(404).json({ error: "Election not found" });
        res.json(election);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
