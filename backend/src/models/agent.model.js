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
    agentTradingSessionID: {
      type: Number,
      required: true,
    },
    agentIsTradingSession: {
      type: Boolean,
      required: true,
    },
  },
  { strict: true }
);

const agentModel = mongoose.model("Agent", agentSchema);

module.exports = agentModel;
