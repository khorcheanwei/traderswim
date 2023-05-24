const axios = require('axios');
const jwt = require("jsonwebtoken");
const node_cache = require("node-cache");
const cache = new node_cache();

const jwtSecret = "traderswim";

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
} = require("../data-access/index.js");

const { puppeteer_login_account, get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")

// get stock pair 
async function copy_trading_stock_pair_list() {
  try {
    const key = "stockPairList";
    let stockPairList = [];
    if (cache.get(key)) {
      stockPairList = cache.get(key);
    } else {
      const result = await axios.get("https://api.cryptowat.ch/pairs");
      const stockPairInfoList = result["data"]["result"];

      //stockPairInfoList.length
      for (let index = 0; index < 2; index++) {
        const stockPair = stockPairInfoList[index]["symbol"];
        const stockPairId = stockPairInfoList[index]["id"]

        stockPairList.push({ value: stockPairId, label: stockPair });
      }

      cache.set("stockPairList", stockPairList, 300)
    }

    return { success: true, data: stockPairList };
  } catch (error) {
    return { success: false, data: error.message };
  }
}

// Copy trading place order
async function copy_trading_place_order(httpRequest) {
  const {
    stockName,
    stockTradeAction,
    stockTradeType,
    stockSharesTotal,
    stockEntryPrice,
  } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      // get agent trading sessionID
      let result = await agentDBOperation.searchAgentTradingSessionID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }

      agentDocument = result.data;
      const agentTradingSessionID = agentDocument.agentTradingSessionID + 1;

      // get all accountName of particular agentID
      result = await accountDBOperation.searchAccountByAgentID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const accountDocument = result.data;

      Object.keys(accountDocument).forEach(async function (key, index) {
        // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

        let accountUsername = accountDocument[index].accountUsername;
        const authToken = await get_access_token_from_cache(agentID, accountUsername);

        if (authToken != null) {
          let config = {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }

          let payload = {
            "orderType": "MARKET",
            "session": "NORMAL",
            "duration": "DAY",
            "orderStrategyType": "SINGLE",
            "orderLegCollection": [
              {
                "instruction": "Buy",
                "quantity": 1,
                "instrument": {
                  "symbol": "GOOG",
                  "assetType": "EQUITY"
                }
              }
            ]
          }

          await axios.get('https://api.tdameritrade.com/v1/accounts', headers = config, data = payload)
            .then(response => {
              console.log(response.message)
              //httpResponse.status(200).json(response.data[0]);
            })
            .catch(error => {
              // Handle any errors
              console.log(error.message)
              //httpResponse.status(400).json(error.message);
            });
        } else {
          console.error(`No access token for agent ID ${agentID} and account username ${accountUsername}`);

        }

      });


      result =
        await copyTradingAccountDBBOperation.createCopyTradingAccountItem(
          accountDocument,
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
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

// Copy trading database
async function copy_trading_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      agentID = agentDocument.id;

      // get agent trading sessionID
      let result = await agentDBOperation.searchAgentTradingSessionID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      agentDocument = result.data;
      const agentTradingSessionID = agentDocument.agentTradingSessionID;

      // get CopyTradingAccount based on agentID and agentTradingSessionID
      result =
        await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionID(
          agentID,
          agentTradingSessionID
        );

      if (result.success != true) {
        return { success: false, data: result.error };
      }
      copyTradingAccountDocument = result.data;

      let copyTradingAccountData = [];
      for (let index = 0; index < copyTradingAccountDocument.length; index++) {
        const currCopyTradingAccount = copyTradingAccountDocument[index];
        copyTradingAccountData.push({
          accountName: currCopyTradingAccount.accountName,
          accountUsername: currCopyTradingAccount.accountUsername,
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
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

// copy trading history database
async function copy_trading_history_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      agentID = agentDocument.id;

      try {
        // get CopyTradingAccount based on agentID and agentTradingSessionID
        const result =
          await copyTradingAccountDBBOperation.searchCopyTradingAccount(
            agentID
          );

        if (result.success != true) {
          return { success: false, data: result.error };
        }
        const copyTradingAccountDocument = result.data;

        let tradeHistoryData = [];

        for (
          let index = copyTradingAccountDocument.length - 1;
          0 <= index;
          index--
        ) {
          const currCopyTradingAccount = copyTradingAccountDocument[index];

          tradeHistoryData.push({
            agentTradingSessionID: currCopyTradingAccount.agentTradingSessionID,
            accountName: currCopyTradingAccount.accountName,
            accountUsername: currCopyTradingAccount.accountUsername,
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
        return { success: false, data: error.message };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
  copy_trading_stock_pair_list,
  copy_trading_place_order,
  copy_trading_database,
  copy_trading_history_database,
};
