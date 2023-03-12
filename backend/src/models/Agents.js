const mongoose = require("moogoose");

const agentSchema = new mongoose.Schema({
  agentID: Number,
  agentUsername: String,
  agentPassword: String,
});

const AgentModel = moogoose.model("Agent", agentSchema);

module.exports = AgentModel;
