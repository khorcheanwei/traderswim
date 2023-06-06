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

const {
    sync_order_and_save_to_copy_trading_database
} = require("./copyTradingAccountController.js");

const { puppeteer_login_account, get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")

// cancel order
async function cancel_order(config, accountUsername) {
  try {
    const response = await axios.request(config);
    console.log(`Successful cancel order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    if (response.status == 200 || response.status == 201) {
      return true;
    } else {
      return false;
    }
    
  } catch (error) {
    console.log(`Failed cancel order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return false;
  }
}

// Delete cancel order for all trading accounts
async function delete_cancel_order_all_accounts(all_trading_accounts_list, optionChainOrderIdList) {
  const delete_cancel_order_api_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { accountId, accountUsername, authToken } = api_data;
    const optionChainOrderId = optionChainOrderIdList[index];

    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountId}/orders/${optionChainOrderId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
    }
    const result = await cancel_order(config, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(delete_cancel_order_api_requests);
    console.log('DELETE cancel order API requests completed.');
    return result_promise;
  } catch (error) {
    console.log(`Error in DELETE cancel order API requests completed. Error: ${error.message}`);
    return null;
  }
}
// Copy trading cancel order
async function copy_trading_cancel_order(httpRequest) {
  const { agentTradingSessionID } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

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

      // get all optionChainOrderId based on agentID and agentTradingSessionID
      const optionChainOrderIdList = await copyTradingAccountDBBOperation.getAllOrderID(agentID, agentTradingSessionID)
      // DELETE cancel order for all trading accounts
      const result_promise_cancel_order = await delete_cancel_order_all_accounts(all_trading_accounts_list, optionChainOrderIdList);

      // sync order and save to copy trading table for all trading accounts
      await sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID)
      
      return { success: true, data: "success" };
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
    copy_trading_cancel_order
};
