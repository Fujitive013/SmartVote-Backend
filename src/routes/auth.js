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

const router = express.Router();

router.post("/register", isValidUserRegister, validateRequest, registerUser);
router.post("/login", isValidUserLogin, validateRequest, loginUser);
router.post("/logout", logoutUser);
router.get("/refresh-token", newToken);

module.exports = router;
