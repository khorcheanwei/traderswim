const mongoose = require("mongoose");
const { Schema } = mongoose;

const accountSchema = new Schema(
  {
    agentID: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
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
  },
  { strict: true }
);

const AccountModel = mongoose.model("Account", accountSchema);

module.exports = AccountModel;
