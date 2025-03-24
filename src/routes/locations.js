const express = require("express");
const fetchCities = require("../controllers/locationsControllers");
const { authenticateUser } = require("../utils/authUtils");

const router = express.Router();
router.get("/fetchCities", authenticateUser, fetchCities);
module.exports = router;
