const mongoose = require("mongoose");
const { Schema } = mongoose;

const copyTradingAccountSchema = new Schema({
  agentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  masterAccountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  copierAccountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  tradeRiskType: {
    type: String,
    required: true,
    enum: ["None", "Fixed Lot", "Lot Multiplier"],
  },
  tradeRiskPercent: {
    type: Number,
    required: true,
  },
});

const CopyTradingAccountModel = mongoose.model(
  "CopyTradingAccount",
  copyTradingAccountSchema
);

module.exports = CopyTradingAccountModel;
