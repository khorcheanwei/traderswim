const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema({
  agentID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
  accountName: {
    type: String,
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
});

const AccountModel = mongoose.model("Account", accountSchema);

module.exports = AccountModel;
