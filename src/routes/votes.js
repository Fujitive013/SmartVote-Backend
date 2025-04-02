const express = require("express");
const {
    castVote,
    checkVote,
    getVoteStatus,
    countVotes,
} = require("../controllers/votesControllers");
const { authenticateUser } = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/", authenticateUser, castVote);
router.get("/check", authenticateUser, checkVote);
router.get("/status", authenticateUser, getVoteStatus);
router.get("/count/:candidate_id", authenticateUser, countVotes);

module.exports = router;
