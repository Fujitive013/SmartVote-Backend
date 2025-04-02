const { body, validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const { decodeToken } = require("../utils/jwtUtils");

const isValidUserRegister = [
    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isString()
        .withMessage("First name must be a string")
        .isLength({ min: 2 })
        .withMessage("First name must be at least 2 characters long"),
    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isString()
        .withMessage("Last name must be a string")
        .isLength({ min: 2 })
        .withMessage("Last name must be at least 2 characters long"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
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
        }),
    body("baranggay_id")
        .trim()
        .custom((value) => {
            if (!ObjectId.isValid(value)) {
                throw new Error("Invalid baranggay ID");
            }
            return true;
        }),
];

const isValidUserLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isString()
        .withMessage("Email must be a string")
        .isEmail()
        .withMessage("Invalid email address"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isString()
        .withMessage("Password must be a string")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
];

const isAdmin = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ error: "Authorization header required" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = decodeToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        next();
    } catch (err) {
        console.error("Error in isAdmin middleware:", err);
        res.status(500).json({ error: "Server error" });
    }
};

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    isValidUserRegister,
    isValidUserLogin,
    isAdmin,
    validateRequest,
};
