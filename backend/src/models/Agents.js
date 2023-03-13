const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agentUsername: {
    type: String,
    unique: true,
    required: true,
  },
  agentEmail: {
    type: String,
    required: true,
  },
  agentPassword: {
    type: String,
    required: true,
  },
});

const AgentModel = mongoose.model("Agent", agentSchema);

module.exports = AgentModel;
