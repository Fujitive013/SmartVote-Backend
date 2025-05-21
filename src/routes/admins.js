const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/adminControllers");
const {
    isAdmin,
    validateRequest,
} = require("../middlewares/validationMiddleware");

router.get("/usersList", isAdmin, validateRequest, getAllUsers); // GET /api/users

module.exports = router;
