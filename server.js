const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./libs/db");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);
const electionsRouter = require("./routes/elections");
app.use("/elections", electionsRouter);
const votesRouter = require("./routes/votes");
app.use("/votes", votesRouter);

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Server is running correctly" });
    console.log("message received");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
