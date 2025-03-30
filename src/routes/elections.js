const express = require("express");
const {
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
} = require("../controllers/electionsControllers");
const { isAdmin, validateRequest } = require("../utils/isValidUser");
const { authenticateUser } = require("../utils/authUtils");

const router = express.Router();

router.post("/", authenticateUser, isAdmin, validateRequest, createElection);

router.get("/", authenticateUser, getAllElections);

router.get("/:id", authenticateUser, getElectionById);

router.get(
    "/getByLocation/:city_id/:baranggay_id?",
    authenticateUser,
    getElectionsByLocation
);
module.exports = router;
