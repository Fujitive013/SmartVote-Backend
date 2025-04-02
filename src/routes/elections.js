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
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticateUser, isAdmin, validateRequest, createElection); // dapat sa token mag checking sa role

router.get("/", authenticateUser, getAllElections);

router.get("/:id", authenticateUser, getElectionById);

router.get(
    "/getByLocation/:city_id/:baranggay_id?",
    authenticateUser,
    getElectionsByLocation
);
module.exports = router;
