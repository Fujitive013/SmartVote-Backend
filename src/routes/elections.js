const express = require("express");
const {
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
    getCurrentElectionResults,
} = require("../controllers/electionsControllers");

const {
    isAdmin,
    validateRequest,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

// Create election (admin only)
router.post("/", isAdmin, validateRequest, createElection);
router.get("/", getAllElections);
router.get("/results/:election_id", getCurrentElectionResults);

// Get elections by location
router.get("/getByLocation/:city_id/:baranggay_id?", getElectionsByLocation);

// Get specific election by ID
router.get("/:id", getElectionById);

module.exports = router;
