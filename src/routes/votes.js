const express = require("express");
const {
    castVote,
    checkVote,
    getVoteStatus,
    countVotes,
} = require("../controllers/votesControllers");

const router = express.Router();

router.post("/", castVote);
router.get("/check", checkVote);
router.get("/status", getVoteStatus);
router.get("/count/:candidate_id", countVotes);
// router.get("/results/:election_id", getCurrentElectionResults);

module.exports = router;
