const AgentModel = require("../models/Agent");
const agentDB = require("./agent.db.js");
const agentDBOperation = new agentDB(AgentModel);

const AccountModel = require("../models/Account");
const accountDB = require("./account.db.js");
const accountDBOperation = new accountDB(AccountModel);

const CopyTradingAccountModel = require("../models/CopyTradingAccount");
const copyTradingAccountDB = require("./copyTrading.db.js");
const copyTradingAccountDBBOperation = new copyTradingAccountDB(
  CopyTradingAccountModel
);

module.exports = {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
};
