const mongoose = require('mongoose');
const VoteSchema = require('./schemas/VoteSchema');

module.exports = mongoose.model("Vote", VoteSchema);