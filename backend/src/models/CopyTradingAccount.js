const mongoose = require("mongoose");
const { Schema } = mongoose;

const copyTradingAccountSchema = new Schema({
  agentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  agentTradingSessionID: {
    type: Number,
    required: true,
  },
  accountID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
  stockTradeAction: {
    type: String,
    required: true,
  },
  stockTradeType: {
    type: String,
    required: true,
  },
  stockEntryPrice: {
    type: Number,
    required: true,
  },
  stockEntryPriceCurrency: {
    type: String,
    required: true,
  },
  orderQuantity: {
    type: Number,
    required: true,
  },
  filledQuantity: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
});

const CopyTradingAccountModel = mongoose.model(
  "CopyTradingAccount",
  copyTradingAccountSchema
);

module.exports = CopyTradingAccountModel;
