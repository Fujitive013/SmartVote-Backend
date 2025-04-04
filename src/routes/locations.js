const express = require("express");
const {
    fetchCities,
    fetchCitiesAll,
} = require("../controllers/locationsControllers");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/fetchCities/:id", authenticateUser, fetchCities);
router.get("/fetchCitiesAll", fetchCitiesAll);

module.exports = router;
