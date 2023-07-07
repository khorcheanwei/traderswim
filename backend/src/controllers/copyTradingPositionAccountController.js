const axios = require('axios');
const jwt = require("jsonwebtoken");

var Memcached = require('memcached-promise');
var copy_trading_position_cache = new Memcached('127.0.0.1:11211', {maxExpiration: 2592000});

const jwtSecret = "traderswim";

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
} = require("../data-access/index.js");

const { get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")

// get position information
async function get_position_information(config, accountName, accountUsername, optionChainSymbolList) {
  let copyTradingPositionAccountData = [];

  try {
    let response = await axios.request(config);
    let position_list = response.data["securitiesAccount"]["positions"];

    if (position_list == undefined) {
      console.log(`Failed get position information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}.`);
      return copyTradingPositionAccountData;
    }

    for (let index = 0; index < position_list.length; index++) {

        let current_position = position_list[index];
        if (current_position["instrument"]["assetType"] == "OPTION") {
            let current_symbol = current_position["instrument"]["symbol"];
            let current_description = current_position["instrument"]["description"];
            let current_averagePrice = current_position["averagePrice"];
            let current_settledLongQuantity = current_position["longQuantity"];
            let current_settledShortQuantity = current_position["shortQuantity"];
            
            copyTradingPositionAccountData.push({accountName: accountName, accountUsername: accountUsername, optionChainSymbol: current_symbol, optionChainDescription: current_description, optionChainAveragePrice: current_averagePrice,
               optionChainSettledLongQuantity: current_settledLongQuantity, optionChainSettledShortQuantity: current_settledShortQuantity})
        }
    }
    console.log(`Successful get position information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    return copyTradingPositionAccountData;

  } catch (error) {
    console.log(`Failed get position information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return copyTradingPositionAccountData;
  }
}

// get position information for all accounts
async function get_position_information_all_accounts(all_trading_accounts_list) {
  const get_position_information_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { agentID, accountId, accountName, accountUsername, optionChainOrderId, authToken } = api_data;
    let config = {
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

    const result = await get_position_information(config, accountName, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(get_position_information_requests);
    console.log('Get position information for all trading accounts promise requests completed');
    return result_promise.flat();
  } catch (error) {
    console.log(`Error in get position information for all trading accounts promise requests completed. Error: ${error.message}`);
    return null;
  }
}


// Copy trading position database for cron job 
async function copy_trading_position_by_agent(agentID) { 
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
    
      all_trading_accounts_list.push({ accountId: accountId, accountName: accountName, accountUsername: accountUsername, authToken: authToken })
    }

    const copyTradingPositionAccountDocument = await get_position_information_all_accounts(all_trading_accounts_list);
    let copyTradingPositionDataDict = {};
    for (let index = 0; index < copyTradingPositionAccountDocument.length; index++) {
      const current_copyTradingAccount = copyTradingPositionAccountDocument[index];
      const current_optionChainDescription = current_copyTradingAccount["optionChainDescription"];
      const current_optionChainSettledLongQuantity = current_copyTradingAccount["optionChainSettledLongQuantity"];
      const current_optionChainSettledShortQuantity = current_copyTradingAccount["optionChainSettledShortQuantity"];

      let current_optionChainSettledQuantity = 0;
      if (current_optionChainSettledLongQuantity != 0) {
        current_optionChainSettledQuantity = current_optionChainSettledLongQuantity;
      }

      if (current_optionChainSettledShortQuantity != 0) {
        current_optionChainSettledQuantity = -current_optionChainSettledShortQuantity;
      }

      const currCopyTradingPositionAccountData = {
        accountName: current_copyTradingAccount["accountName"],
        accountUsername: current_copyTradingAccount["accountUsername"],
        optionChainAveragePrice: current_copyTradingAccount["optionChainAveragePrice"],
        optionChainSymbol: current_copyTradingAccount["optionChainSymbol"],
        optionChainDescription: current_optionChainDescription,
        optionChainSettledQuantity: current_optionChainSettledQuantity,
      }

      if (copyTradingPositionDataDict.hasOwnProperty(current_optionChainDescription) == false) {
        copyTradingPositionDataDict[current_optionChainDescription] = [currCopyTradingPositionAccountData]
      } else {
        copyTradingPositionDataDict[current_optionChainDescription].push(currCopyTradingPositionAccountData);
      }
    }

    // save copyTradingPositionDataDict from cache
    let copyTradingPositionDataDict_key = agentID + "." + "copyTradingPositionDataDict";
    await copy_trading_position_cache.set(copyTradingPositionDataDict_key, copyTradingPositionDataDict, 3600)

    return copyTradingPositionDataDict;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Copy trading position database
async function copy_trading_position_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
        let agentDocument = jwt.verify(token, jwtSecret, {});
        agentID = agentDocument.id;

        // get copyTradingPositionDataDict from cache
        let copyTradingPositionDataDict_key = agentID + "." + "copyTradingPositionDataDict";
        let copyTradingPositionDataDict = await copy_trading_position_cache.get(copyTradingPositionDataDict_key);
       
        if (copyTradingPositionDataDict != undefined) {
          return { success: true, data: copyTradingPositionDataDict };
        }

        copyTradingPositionDataDict = await copy_trading_position_by_agent(agentID)
        
        return { success: true, data: copyTradingPositionDataDict };

    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
    copy_trading_position_database,
    copy_trading_position_by_agent
};
