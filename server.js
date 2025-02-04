const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoURI =
    "mongodb+srv://axel:paredes@cluster0.pqj1w.mongodb.net/SmartVote";

mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error: ", err));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);
const electionsRouter = require("./routes/elections");
app.use("/elections", electionsRouter);
const votesRouter = require("./routes/votes");
app.use("/votes", votesRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
