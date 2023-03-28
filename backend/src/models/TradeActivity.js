const mongoose = require("mongoose");
const { Schema } = mongoose;

const tradeActivitySchema = new Schema({
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
  stockName: {
    type: String,
    required: true,
    enum: ["None", "Fixed Lot", "Lot Multiplier"],
  },
  leverage: {
    type: Number,
    required: true,
  },
  entryPrice: {
    type: Number,
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

const TradeActivityModel = mongoose.model("TradeActivity", tradeActivitySchema);

module.exports = TradeActivityModel;
