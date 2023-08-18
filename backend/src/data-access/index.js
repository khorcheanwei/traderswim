let sqlite3 = require('sqlite3').verbose();;

// create trading_management database 
const trading_management_db = new sqlite3.Database('trading_management.db', (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log('Connected to the database');
  }
});

// new agent table
const AgentSchemaSql = require("../models/Agent");
trading_management_db.run(AgentSchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Agent table created (if it did not already exist).');
};

// new account table
const AccountSchemaSql = require("../models/Account");
trading_management_db.run(AccountSchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Account table created (if it did not already exist).');
};

// new stock table
const StockSchemaSql = require("../models/stockTrading/Stock");
trading_management_db.run(StockSchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Stock table created (if it did not already exist).');
};


// new option contract table
const OptionContractSchemaSql = require("../models/OptionContract");
trading_management_db.run(OptionContractSchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Option contract table created (if it did not already exist).');
};

// new option contract save order table
const OptionContractSaveOrderSchemaSql = require("../models/OptionContractSaveOrder");
trading_management_db.run(OptionContractSaveOrderSchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Option contract save order table created (if it did not already exist).');
};

// new copytradingaccount table
const CopyTradingAccountSchemaSql = require("../models/CopyTradingAccount");
trading_management_db.run(CopyTradingAccountSchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Copy trading table created (if it did not already exist).');
};

// new TradeHistory table
const TradeHistorySchemaSql = require("../models/TradeHistory");
trading_management_db.run(TradeHistorySchemaSql), (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log('Trade history table created (if it did not already exist).');
};


// database object
const agentDB = require("./agent.db.js");
const accountDB = require("./account.db.js");
const stockDB = require("./stockTrading/stock.db.js");  

const optionContractDB = require("./optionContract.db.js");  
const optionContractSaveOrderDB = require("./optionContractSaveOrder.db.js");       
const copyTradingAccountDB = require("./copyTrading.db.js");
const tradeHistoryDB = require("./tradeHistory.db.js");

// database operation object
const agentDBOperation = new agentDB(trading_management_db);
const accountDBOperation = new accountDB(trading_management_db);

const stockDBOperation = new stockDB(trading_management_db);
const optionContractDBOperation = new optionContractDB(trading_management_db);
const optionContractSaveOrderDBOperation = new optionContractSaveOrderDB(trading_management_db);
const copyTradingAccountDBBOperation = new copyTradingAccountDB(trading_management_db);
const tradeHistoryDBOperation = new tradeHistoryDB(trading_management_db);


console.log('Backend service start');

module.exports = {
  agentDBOperation,
  accountDBOperation,
  stockDBOperation,
  optionContractDBOperation,
  optionContractSaveOrderDBOperation,
  copyTradingAccountDBBOperation,
  tradeHistoryDBOperation
};
