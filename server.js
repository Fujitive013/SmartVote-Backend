const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);
const electionsRouter = require("./routes/elections");
app.use("/elections", electionsRouter);
const votesRouter = require("./routes/votes");
app.use("/votes", votesRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
