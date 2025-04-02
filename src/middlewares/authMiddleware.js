const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    console.log(authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Authorization header required" });
    }
    const token = authHeader.split(" ")[1]; // Get token from header

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = {
    authenticateUser,
};
