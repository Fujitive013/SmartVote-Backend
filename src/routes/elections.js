const express = require("express");
const {
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
} = require("../controllers/electionsControllers");
const { isAdmin, validateRequest } = require("../utils/isValidUser");

const router = express.Router();

router.post("/", isAdmin, validateRequest, createElection);

router.get("/", getAllElections);

router.get("/:id", getElectionById);

router.get("/getByBaranggay/:city_id/:baranggay_id", getElectionsByLocation);
module.exports = router;
