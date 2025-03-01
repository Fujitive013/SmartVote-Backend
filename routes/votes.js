const express = require("express");
const votesController = require("../controllers/votesControllers");

const router = express.Router();

router.post("/", votesController.castVote);
router.get("/check", votesController.checkVote);
router.get("/status", votesController.getVoteStatus);
router.get("/count/:candidate_id", votesController.countVotes);

module.exports = router;
