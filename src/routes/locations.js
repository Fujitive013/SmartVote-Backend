const express = require("express");
const {
    fetchCities,
    fetchCitiesAll,
} = require("../controllers/locationsControllers");

const router = express.Router();

router.get("/fetchCities/:id", fetchCities);
router.get("/fetchCitiesAll", fetchCitiesAll);

module.exports = router;
