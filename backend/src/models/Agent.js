const mongoose = require("mongoose");
const { Schema } = mongoose;

const agentSchema = new Schema(
  {
    agentUsername: {
      type: String,
      unique: true,
      required: true,
    },
    agentEmail: {
      type: String,
      unique: true,
      required: true,
    },
    agentPassword: {
      type: String,
      required: true,
    },
  },
  { strict: true }
);

const AgentModel = mongoose.model("Agent", agentSchema);

module.exports = AgentModel;
