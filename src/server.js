const express = require("express");
require("dotenv").config();
const connectDB = require("./libs/db");
const packageInfo = require("../package.json");
const authRouter = require("./routes/auth");
const electionsRouter = require("./routes/elections");
const votesRouter = require("./routes/votes");
const locationsRouter = require("./routes/locations");
const corsConfig = require("./config/corsConfig");
const app = express();
const { authenticateUser } = require("./middlewares/authMiddleware");

app.use(corsConfig);

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
app.use("/locations", locationsRouter);

// app.use authenticate middleware
app.use(authenticateUser); // no need to specify sa each route
app.use("/elections", electionsRouter);
app.use("/votes", votesRouter);

