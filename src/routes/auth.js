const express = require("express");
const {
    registerUser,
    loginUser,
    logoutUser,
    newToken,
} = require("../controllers/authControllers");
const {
    isValidUserRegister,
    isValidUserLogin,
    validateRequest,
} = require("../middlewares/validationMiddleware");

const limiter = require("../libs/rateLimit"); // Changed to direct import

const router = express.Router();

// Apply rate limiting to both register and login routes
router.post(
    "/register",
    limiter,
    isValidUserRegister,
    validateRequest,
    registerUser
);
router.post("/login", limiter, isValidUserLogin, validateRequest, loginUser);
router.post("/logout", logoutUser);
router.get("/refresh-token", newToken);

module.exports = router;
