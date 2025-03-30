const express = require("express");
require("dotenv").config();
const connectDB = require("./libs/db");
const packageInfo = require("../package.json");
const authRouter = require("./routes/auth");
const electionsRouter = require("./routes/elections");
const votesRouter = require("./routes/votes");
const locationsRouter = require("./routes/locations");
const cors = require("cors");
const app = express();

const allowedOrigins = [process.env.API_URL, "http://localhost:3000"];
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                // Allow requests from Vercel and Postman (null origin)
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const StartServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("Error connecting to the database", error);
    }
};

StartServer();

app.use("/auth", authRouter);

// app.use authenticate middleware

app.use("/elections", electionsRouter);
app.use("/votes", votesRouter);
app.use("/locations", locationsRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        status: "online",
        id: packageInfo.version,
        message: packageInfo.name,
        members: packageInfo.contributors,
    });
    console.log(`System ${packageInfo.name} is running`);
});

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Server is running correctly" });
    console.log("Test message received");
});
