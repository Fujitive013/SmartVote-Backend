const express = require("express");
const {
    castVote,
    checkVote,
    getVoteStatus,
    countVotes,
    getUserVotes,
} = require("../controllers/votesControllers");
const { authenticateUser } = require("../utils/authUtils");

const router = express.Router();

router.post("/", authenticateUser, castVote);
router.get("/check", authenticateUser, checkVote);
router.get("/status", authenticateUser, getVoteStatus);
router.get("/count/:candidate_id", authenticateUser, countVotes);
router.get("/user", authenticateUser, getUserVotes);

module.exports = router;
