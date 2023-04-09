const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
} = require("../data-access/index.js");

// Copy trading place order
async function copy_trading_place_order(httpRequest) {
  const {
    agentID,
    stockName,
    stockTradeAction,
    stockTradeType,
    stockSharesTotal,
    stockEntryPrice,
  } = httpRequest.body;

  try {
    // get agent trading sessionID
    var result = await agentDBOperation.searchAgentTradingSessionID(agentID);
    if (result.success != true) {
      return { success: false, data: result.error };
    }
    const agentsDocument = result.data;
    const agentTradingSessionID = agentsDocument.agentTradingSessionID + 1;

    // get all accountName of particular agentID
    result = await accountDBOperation.searchAccountNameByAgentID(agentID);
    if (result.success != true) {
      return { success: false, data: result.error };
    }
    const accountsDocument = result.data;
    result = await copyTradingAccountDBBOperation.createCopyTradingAccountItem(
      accountsDocument,
      agentID,
      agentTradingSessionID,
      stockName,
      stockTradeAction,
      stockTradeType,
      stockEntryPrice,
      stockSharesTotal
    );
    if (result.success != true) {
      return { success: false, data: result.error };
    }

    result = await agentDBOperation.updateAgentTradingSessionID(
      agentID,
      agentTradingSessionID
    );
    if (result.success != true) {
      return { success: false, data: result.error };
    }

    // save agentTradingSessionID and agentIsTradingSession to table Agent
    return { success: true, data: "success" };
  } catch (error) {
    return { success: false, data: result.error };
  }
}

// Copy trading database
async function copy_trading_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      const agentDoc = await jwt.verify(token, jwtSecret, {});
      agentID = agentDoc.id;

      // get agent trading sessionID
      var result = await agentDBOperation.searchAgentTradingSessionID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const agentsDocument = result.data;
      const agentTradingSessionID = agentsDocument.agentTradingSessionID;

      // get CopyTradingAccount based on agentID and agentTradingSessionID
      result =
        await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionID(
          agentID,
          agentTradingSessionID
        );

      if (result.success != true) {
        return { success: false, data: result.error };
      }
      copyTradingAccountsDocument = result.data;

      var copyTradingAccountData = [];
      for (let index = 0; index < copyTradingAccountsDocument.length; index++) {
        const currCopyTradingAccount = copyTradingAccountsDocument[index];
        copyTradingAccountData.push({
          accountName: currCopyTradingAccount.accountName,
          stockPair:
            currCopyTradingAccount.stockName +
            "/" +
            currCopyTradingAccount.stockEntryPriceCurrency,
          stockTradeAction: currCopyTradingAccount.stockTradeAction,
          entryPrice: currCopyTradingAccount.stockEntryPrice,
          orderQuantity: currCopyTradingAccount.orderQuantity,
          filledQuantity: currCopyTradingAccount.filledQuantity,
          orderDate: currCopyTradingAccount.orderDate.toLocaleString("en-US"),
          placeNewOrder: "",
        });
      }

      return { success: true, data: copyTradingAccountData };
    } catch (error) {
      return { success: false, data: error };
    }
  } else {
    return { success: false, data: null };
  }
}

// copy trading history database
async function copy_trading_history_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      const agentDoc = await jwt.verify(token, jwtSecret, {});
      agentID = agentDoc.id;

      try {
        // get CopyTradingAccount based on agentID and agentTradingSessionID
        const result =
          await copyTradingAccountDBBOperation.searchCopyTradingAccount(
            agentID
          );

        if (result.success != true) {
          return { success: false, data: result.error };
        }
        const copyTradingAccountsDocument = result.data;

        var tradeHistoryData = [];

        for (
          let index = copyTradingAccountsDocument.length - 1;
          0 <= index;
          index--
        ) {
          const currCopyTradingAccount = copyTradingAccountsDocument[index];

          tradeHistoryData.push({
            agentTradingSessionID: currCopyTradingAccount.agentTradingSessionID,
            accountName: currCopyTradingAccount.accountName,
            stockPair:
              currCopyTradingAccount.stockName +
              "/" +
              currCopyTradingAccount.stockEntryPriceCurrency,
            stockTradeAction: currCopyTradingAccount.stockTradeAction,
            entryPrice: currCopyTradingAccount.stockEntryPrice,
            orderQuantity: currCopyTradingAccount.orderQuantity,
            filledQuantity: currCopyTradingAccount.filledQuantity,
            orderDate: currCopyTradingAccount.orderDate.toLocaleString("en-US"),
          });
        }
        return { success: true, data: tradeHistoryData };
      } catch (error) {
        return { success: false, data: error };
      }
    } catch (error) {
      return { success: false, data: error };
    }
  } else {
    return { success: false, data: null };
  }
}

module.exports = {
  copy_trading_place_order,
  copy_trading_database,
  copy_trading_history_database,
};
