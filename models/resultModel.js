const mongoose = require('mongoose');
const ResultSchema = require('./schemas/ResultSchema');

module.exports = mongoose.model("Result", ResultSchema);