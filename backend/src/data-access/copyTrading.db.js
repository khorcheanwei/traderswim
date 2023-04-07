const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function copyTradingAccountDBOperation(CopyTradingAccount) {
  this.CopyTradingAccount = CopyTradingAccount;

  // search searchCopyTradingAccount based on tradingSessionID
  this.searchCopyTradingAccountBasedTradingSessionID = async function (
    agentID,
    agentTradingSessionID
  ) {
    try {
      const queryResult = await CopyTradingAccount.find({
        agentID: agentID,
        agentTradingSessionID: agentTradingSessionID,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search searchCopyTradingAccount
  this.searchCopyTradingAccount = async function (agentID) {
    try {
      const queryResult = await CopyTradingAccount.find({
        agentID: agentID,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // create new copyTradingAccount
  this.createCopyTradingAccountItem = async function (
    accountsDocument,
    agentID,
    agentTradingSessionID,
    stockName,
    stockTradeAction,
    stockTradeType,
    stockEntryPrice,
    stockSharesTotal
  ) {
    try {
      for (let index = 0; index < accountsDocument.length; index++) {
        await this.CopyTradingAccount.create({
          agentID: agentID,
          agentTradingSessionID: agentTradingSessionID,
          accountID: accountsDocument[index]._id,
          accountName: accountsDocument[index].accountName,
          stockName: stockName,
          stockTradeAction: stockTradeAction,
          stockTradeType: stockTradeType,
          stockEntryPrice: stockEntryPrice,
          stockEntryPriceCurrency: "USD",
          orderQuantity: stockSharesTotal,
          filledQuantity: 0,
          orderDate: Date.now(),
        });
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };
}
module.exports = copyTradingAccountDBOperation;
