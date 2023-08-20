const axios = require('axios');
const jwt = require("jsonwebtoken");

var Memcached = require('memcached-promise');
var stock_copy_trading_position_cache = new Memcached('127.0.0.1:11211', {maxExpiration: 2592000});

const jwtSecret = "traderswim";

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
} = require("../../data-access/index.js");

const { get_access_token_from_cache, fetch_trading_account_info_api } = require("./../tradingAccountPuppeteer.js")

// get position information
async function get_position_information(config, accountId, accountName, accountUsername) {
  let stockCopyTradingPositionAccountData = [];

  try {
    let response = await axios.request(config);
    let position_list = response.data["securitiesAccount"]["positions"];

    if (position_list == undefined) {
      console.log(`Failed get position information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}.`);
      return stockCopyTradingPositionAccountData;
    }

    for (let index = 0; index < position_list.length; index++) {

        let current_position = position_list[index];
        if (current_position["instrument"]["assetType"] == "EQUITY") {
            let current_symbol = current_position["instrument"]["symbol"];
            let current_averagePrice = current_position["averagePrice"];
            let current_settledLongQuantity = current_position["longQuantity"];
            let current_settledShortQuantity = current_position["shortQuantity"];
            
            stockCopyTradingPositionAccountData.push({accountId: accountId, accountName: accountName, accountUsername: accountUsername, stockSymbol: current_symbol, stockAveragePrice: current_averagePrice,
               stockSettledLongQuantity: current_settledLongQuantity, stockSettledShortQuantity: current_settledShortQuantity})
        }
    }
    console.log(`Successful get stock position information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    return stockCopyTradingPositionAccountData;

  } catch (error) {
    console.log(`Failed get stock position information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return stockCopyTradingPositionAccountData;
  }
}

// get position information for all accounts
async function get_position_information_all_accounts(all_trading_accounts_list) {
  const get_position_information_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { agentID, accountId, accountName, accountUsername, stockOrderId, authToken } = api_data;

    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.tdameritrade.com/v1/accounts/${accountId}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        params: {
            'fields': 'positions'
        }
    }

    const result = await get_position_information(config, accountId, accountName, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(get_position_information_requests);
    console.log('Get stock position information for all trading accounts promise requests completed');
    return result_promise.flat();
  } catch (error) {
    console.log(`Error in get stock position information for all trading accounts promise requests completed. Error: ${error.message}`);
    return null;
  }
}


// Copy trading position database for cron job 
async function stock_copy_trading_position_by_agent(agentID) { 
  try {
    // get all accountName of particular agentID
    let result = await accountDBOperation.searchAccountByAgentID(agentID);
    if (result.success != true) {
      return { success: false, data: result.error };
    }
    const accountDocument = result.data;
    let all_trading_accounts_list = [];

    for (let index = 0; index < accountDocument.length; index++) {
      let accountId = accountDocument[index]["accountId"];
      let accountName = accountDocument[index]["accountName"];
      let accountUsername = accountDocument[index]["accountUsername"];

      let authToken = await get_access_token_from_cache(agentID, accountUsername);

      all_trading_accounts_list.push({ agentID: agentID,  accountId: accountId, accountName: accountName, accountUsername: accountUsername, stockOrderId: null, authToken: authToken })
    }

    const stockCopyTradingPositionAccountDocument = await get_position_information_all_accounts(all_trading_accounts_list);
    let stockCopyTradingPositionDataDict = {};
    for (let index = 0; index < stockCopyTradingPositionAccountDocument.length; index++) {
      const current_copyTradingAccount = stockCopyTradingPositionAccountDocument[index];
      const current_stockSymbol = current_copyTradingAccount["stockSymbol"];
      const current_stockSettledLongQuantity = current_copyTradingAccount["stockSettledLongQuantity"];
      const current_stockSettledShortQuantity = current_copyTradingAccount["stockSettledShortQuantity"];

      let current_stockSettledQuantity = 0;
      if (current_stockSettledLongQuantity != 0) {
        current_stockSettledQuantity = current_stockSettledLongQuantity;
      }

      if (current_stockSettledShortQuantity != 0) {
        current_stockSettledQuantity = -current_stockSettledShortQuantity;
      }

      const currCopyTradingPositionAccountData = {
        accountId: current_copyTradingAccount["accountId"],
        accountName: current_copyTradingAccount["accountName"],
        accountUsername: current_copyTradingAccount["accountUsername"],
        stockAveragePrice: current_copyTradingAccount["stockAveragePrice"],
        stockSymbol: current_stockSymbol,
        stockSettledQuantity: current_stockSettledQuantity,
      }

      if (stockCopyTradingPositionDataDict.hasOwnProperty(current_stockSymbol) == false) {
        stockCopyTradingPositionDataDict[current_stockSymbol] = [currCopyTradingPositionAccountData]
      } else {
        stockCopyTradingPositionDataDict[current_stockSymbol].push(currCopyTradingPositionAccountData);
      }
    }

    // save stockCopyTradingPositionDataDict from cache
    let stockCopyTradingPositionDataDict_key = agentID + "." + "stockCopyTradingPositionDataDict";
    await stock_copy_trading_position_cache.set(stockCopyTradingPositionDataDict_key, stockCopyTradingPositionDataDict, 3600)

    return stockCopyTradingPositionDataDict;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Copy trading position database
async function stock_copy_trading_position_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
        let agentDocument =jwt.verify(token, jwtSecret, {});
        agentID = agentDocument.id;

        // get stockCopyTradingPositionDataDict from cache
        let stockCopyTradingPositionDataDict_key = agentID + "." + "stockCopyTradingPositionDataDict";
        let stockCopyTradingPositionDataDict = await stock_copy_trading_position_cache.get(stockCopyTradingPositionDataDict_key);
       
        if (stockCopyTradingPositionDataDict != undefined) {
          return { success: true, data: stockCopyTradingPositionDataDict };
        }

        stockCopyTradingPositionDataDict = await stock_copy_trading_position_by_agent(agentID)
        
        return { success: true, data: stockCopyTradingPositionDataDict };

    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
    stock_copy_trading_position_database,
    stock_copy_trading_position_by_agent
};