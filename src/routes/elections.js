const express = require("express");
const {
    isAdmin,
    createElection,
    getAllElections,
    getElectionById,
} = require("../controllers/electionsControllers");

const router = express.Router();

router.post("/", isAdmin, createElection);

router.get("/", getAllElections);

router.get("/:id", getElectionById);

module.exports = router;
