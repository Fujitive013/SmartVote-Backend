const cors = require("cors");

const allowedOrigins = [
    process.env.API_URL,
    "http://localhost:3000",
    "http://localhost:5173",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            // Allow requests from allowed origins or tools like Postman (null origin)
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
};

module.exports = cors(corsOptions);
