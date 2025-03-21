const express = require("express");
const {
    isAdmin,
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
} = require("../controllers/electionsControllers");

const router = express.Router();

router.post("/", isAdmin, createElection);

router.get("/", getAllElections);

router.get("/:id", getElectionById);

router.get("/getByBaranggay/:city_id/:baranggay_id", getElectionsByLocation);
module.exports = router;
