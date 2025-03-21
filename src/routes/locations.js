const express = require("express");
const fetchCities = require("../controllers/locationsControllers");

const router = express.Router();
router.get("/fetchCities", fetchCities);
module.exports = router;
