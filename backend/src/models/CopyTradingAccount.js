const mongoose = require("mongoose");
const { Schema } = mongoose;

const copyTradingAccountSchema = new Schema({
  agentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  accountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  masterAccount: {
    type: Boolean,
    required: true,
  },
  copyFromMasterAccount: {
    type: String,
    required: true,
  },
  tradeRiskType: {
    type: String,
    required: true,
    enum: ["None", "Fixed Lot", "Lot Multiplier"],
  },
  accountTradeRiskPercent: {
    type: Number,
    required: true,
  },
});

const CopyTradingAccountModel = mongoose.model(
  "CopyTradingAccount",
  copyTradingAccountSchema
);

module.exports = CopyTradingAccountModel;
