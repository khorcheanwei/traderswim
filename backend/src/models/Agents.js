const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agentID: mongoose.Schema.Types.ObjectId,
  agentUsername: String,
  agentPassword: String,
});

const AgentModel = mongoose.model("Agent", agentSchema);

module.exports = AgentModel;
