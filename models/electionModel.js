const mongoose = require('mongoose');
const ElectionSchema = require('./schemas/ElectionSchema');

module.exports = mongoose.model("Election", ElectionSchema);