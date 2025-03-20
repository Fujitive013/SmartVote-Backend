const mongoose = require("mongoose");
const ResultSchema = require("./schemas/ResultSchema");

const Result = mongoose.model("Result", ResultSchema);
module.exports = Result;
