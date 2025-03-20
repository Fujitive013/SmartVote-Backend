const express = require("express");
require("dotenv").config();
const connectDB = require("./libs/db");
const packageInfo = require("../package.json");
const authRouter = require("./routes/auth");
const electionsRouter = require("./routes/elections");
const votesRouter = require("./routes/votes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const StartServert = async () => {
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

StartServert();

app.use("/auth", authRouter);
app.use("/elections", electionsRouter);
app.use("/votes", votesRouter);

app.get("/", (req, res) => {
    res.status(200).json({
        status: "online",
        id: packageInfo.version,
        message: packageInfo.name,
    });
    console.log(`System ${packageInfo.name} is running`);
});

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Server is running correctly" });
    console.log("Test message received");
});
