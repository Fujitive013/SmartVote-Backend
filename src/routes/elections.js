const express = require("express");
const {
    createElection,
    getAllElections,
    getElectionById,
    getElectionsByLocation,
} = require("../controllers/electionsControllers");
const {
    isAdmin,
    validateRequest,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/", isAdmin, validateRequest, createElection); // dapat sa token mag checking sa role

router.get("/", getAllElections);

router.get("/:id", getElectionById);

router.get("/getByLocation/:city_id/:baranggay_id?", getElectionsByLocation);
module.exports = router;
