const { body, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");

const isValidUserRegister = [
    body("first_name")
        .trim()
        .isString()
        .withMessage("First name must be a string")
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters long"),
    body("last_name")
        .trim()
        .isString()
        .withMessage("Last name must be a string")
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters long"),
    body("email")
        .trim()
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    body("city_id")
        .trim()
        .custom((value) => {
            if (!ObjectId.isValid(value)) {
                throw new Error("Invalid city ID");
            }
            return true;
        }, "Invalid city ID"),
    body("baranggay_id")
        .trim()
        .custom((value) => {
            if (!ObjectId.isValid(value)) {
                throw new Error("Invalid baranggay ID");
            }
            return true;
        }, "Invalid barangaay ID"),
];

const isValidUserLogin = [
    body("email")
        .trim()
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const isAdmin = [
    body("role")
        .trim()
        .isString()
        .withMessage("User role must be a string")
        .isIn(["admin"])
        .withMessage("Invalid user role"),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    next();
};

module.exports = {
    isValidUserRegister,
    isValidUserLogin,
    isAdmin,
    validateRequest,
};
