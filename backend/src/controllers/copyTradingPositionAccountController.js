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

// get position information
async function get_position_information(config, accountUsername) {
  let copyTradingPositionAccountData = [];

  try {
    let response = await axios.request(config);
    let position_list = response.data["securitiesAccount"]["positions"];

    for (let index = 0; index < position_list.length; index++) {

        let current_position = position_list[index];
        if (current_position["instrument"]["assetType"] == "OPTION") {
            let current_symbol = current_position["instrument"]["symbol"];
            let current_description = current_position["instrument"]["description"];
            let current_averagePrice = current_position["averagePrice"];
            let current_longQuantity = current_position["longQuantity"];
            let current_settledLongQuantity = current_position["settledLongQuantity"];
            let current_shortQuantity = current_position["shortQuantity"];
            let current_settledShortQuantity = current_position["settledShortQuantity"];
            
            copyTradingPositionAccountData.push({optionChainSymbol: current_symbol, optionChainDescription: current_description, optionChainAveragePrice: current_averagePrice,
              optionChainLongQuantity: current_longQuantity, optionChainSettledLongQuantity: current_settledLongQuantity, optionChainShortQuantity: current_shortQuantity,
              optionChainSettledShortQuantity: current_settledShortQuantity})
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
    
    let { accountId, accountUsername, authToken } = api_data;
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

    const result = await get_position_information(config, accountUsername);
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

// Copy trading position database
async function copy_trading_position_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
        let agentDocument = jwt.verify(token, jwtSecret, {});
        agentID = agentDocument.id;
        
        // get all accountName of particular agentID
        result = await accountDBOperation.searchAccountByAgentID(agentID);
        if (result.success != true) {
          return { success: false, data: result.error };
        }
        const accountDocument = result.data;
        let all_trading_accounts_list = [];

        for (let index = 0; index < accountDocument.length; index++) {
          let accountId = accountDocument[index].accountId;
          let accountUsername = accountDocument[index].accountUsername;
          let authToken = await get_access_token_from_cache(agentID, accountUsername);

          all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, authToken: authToken })
        }

        let copyTradingPositionAccountData = await get_position_information_all_accounts(all_trading_accounts_list);

        return { success: true, data: copyTradingPositionAccountData };

    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
    copy_trading_position_database,
};
