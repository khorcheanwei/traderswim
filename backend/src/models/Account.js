const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
  agentID: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  masterAccount: {
    type: Boolean,
    required: true,
  },
  accountConnection: {
    type: Boolean,
    required: true,
  },
  accountUsername: {
    type: String,
    required: true,
  },
  accountPassword: {
    type: String,
    required: true,
  },
  accountTradeType: {
    type: String,
    required: true,
  },
  accountTradeRiskPercent: {
    type: Integer,
    required: true,
  },
});

const AccountModel = mongoose.model("Account", accountSchema);

module.exports = AccountModel;
