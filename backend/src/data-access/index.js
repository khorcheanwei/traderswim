var sqlite3 = require('sqlite3').verbose();;

const AgentSchemaSql = require("../models/Agent");
const agentDB = require("./agent.db.js");

const trading_management_db = new sqlite3.Database('trading_management.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the agents database.');
});

trading_management_db.run(AgentSchemaSql), (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Agents table created (if it did not already exist).');
};

trading_management_db.run(AgentSchemaSql);

const agentDBOperation = new agentDB(trading_management_db);


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
