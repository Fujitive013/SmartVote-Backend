const express = require("express");
const { registerUser, loginUser } = require("../controllers/authControllers");
const {
    isValidUserRegister,
    isValidUserLogin,
    validateRequest,
} = require("../utils/isValidUser");

const router = express.Router();

router.post("/register", isValidUserRegister, validateRequest, registerUser);
router.post("/login", isValidUserLogin, validateRequest, loginUser);

module.exports = router;
