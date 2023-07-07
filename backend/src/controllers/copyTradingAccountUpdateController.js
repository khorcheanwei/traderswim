const axios = require('axios');
const jwt = require("jsonwebtoken");

const jwtSecret = "traderswim";

const {
    agentDBOperation,
    accountDBOperation,
    copyTradingAccountDBBOperation,
} = require("../data-access/index.js");

const {
    get_latest_order_id_all_accounts,
    get_latest_order_information_all_accounts,
    createCopyTradingAccountItem_all_accounts,
    sync_order_and_save_to_copy_trading_database
} = require("./copyTradingAccountController.js");

const { get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")


// exit order
async function exit_order(config, accountUsername) {
  try {
    const response = await axios.request(config);
    console.log(`Successful exit order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    if (response.status == 200 || response.status == 201) {
      return true;
    } else {
      return false;
    }
    
  } catch (error) {
    console.log(`Failed exit order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return false;
  }
}

// POST exit order for all trading accounts
async function post_exit_order_all_accounts(all_trading_accounts_list, payload) {
  const post_exit_order_api_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { agentID, accountId, accountName, accountUsername, optionChainOrderId, authToken } = api_data;

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountId}/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      data: payload
    }

    const result = await exit_order(config, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(post_exit_order_api_requests);
    console.log('POST exit order API requests completed.');
    return result_promise;
  } catch (error) {
    console.log(`Error in POST exit order API requests completed. Error: ${error.message}`);
    return null;
  }
}

// Copy trading exit order
async function copy_trading_exit_order(httpRequest) {
  let {
    accountUsernameList,
    optionChainSymbol,
    optionChainInstruction,
    optionChainOrderType,
    optionChainQuantity,
    optionChainPrice,
  } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      // get all accountName of particular agentID
      let result = await accountDBOperation.searchAccountByAgentID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const accountDocument = result.data;
      let newAccountDocument = [];

      let all_trading_accounts_list = [];

      for (let index = 0; index < accountDocument.length; index++) {

        let accountId = accountDocument[index].accountId;
        let accountUsername = accountDocument[index].accountUsername;
        let authToken = await get_access_token_from_cache(agentID, accountUsername);

        if (accountUsernameList.includes(accountUsername)) {
          newAccountDocument.push(accountDocument[index]);
          all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, authToken: authToken });
        }
      }

      // exit order with all accounts of particular agent
      let payload = {
        "complexOrderStrategyType": "NONE",
        "orderType": optionChainOrderType,
        "session": "NORMAL",
        "price": optionChainPrice,
        "duration": "DAY",
        "orderStrategyType": "SINGLE",
        "orderLegCollection": [
          {
            "instruction": optionChainInstruction,
            "quantity": optionChainQuantity,
            "instrument": {
              "symbol": optionChainSymbol,
              "assetType": "OPTION"
            }
          }
        ]
      }

      // POST exit order for all trading accounts
      const result_promise_exit_order = await post_exit_order_all_accounts(all_trading_accounts_list, payload);

      // Get latest order id for all trading accounts
      const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_exit_order);

      // Get latest order information for all trading accounts 
      const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_exit_order, orderId_list)

      // exit order will create new orderId, thus agentTradingSessionID increases by 1
      result = await agentDBOperation.searchAgentTradingSessionID(agentID);

      agentDocument = result.data;
      let agentTradingSessionID = agentDocument.agentTradingSessionID + 1;
      // save orders for all trading accounts to copyTradingAccount table
      await createCopyTradingAccountItem_all_accounts(agentTradingSessionID, newAccountDocument, result_promise_order_information, result_promise_exit_order)
      
      result = await agentDBOperation.updateAgentTradingSessionID(
        agentID,
        agentTradingSessionID
      );
      if (result.success != true) {
        return { success: false, data: result.error };
      }

      return { success: true, data: "success" };
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

// replace order
async function replace_order(config, accountUsername) {
  try {
    const response = await axios.request(config);
    console.log(`Successful replace order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    if (response.status == 200 || response.status == 201) {
      return true;
    } else {
      return false;
    }
    
  } catch (error) {
    console.log(`Failed replace order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return false;
  }
}

// Put replace order for individual trading account
async function copy_trading_put_replace_order_individual(httpRequest) {

  let { agentTradingSessionID, accountId, accountUsername, optionChainOrderId, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice } = httpRequest.body;

  try {
    const { token } = httpRequest.cookies;
    if (token) {
        let agentDocument = jwt.verify(token, jwtSecret, {});
        const agentID = agentDocument.id;
        
        let authToken = await get_access_token_from_cache(agentID, accountUsername);

        // replace order with all accounts of particular agent
        let payload = {
          "complexOrderStrategyType": "NONE",
          "orderType": optionChainOrderType,
          "session": "NORMAL",
          "price": optionChainPrice,
          "duration": "DAY",
          "orderStrategyType": "SINGLE",
          "orderLegCollection": [
            {
              "instruction": optionChainInstruction,
              "quantity": optionChainQuantity,
              "instrument": {
                "symbol": optionChainSymbol,
                "assetType": "OPTION"
              }
            }
          ]
        }

        const config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: `https://api.tdameritrade.com/v1/accounts/${accountId}/orders/${optionChainOrderId}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          data: payload
        }

        const response = await axios.request(config);
        console.log(`Successful replace order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)

        // sync order and save to copy trading table for all trading accounts
        await sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID)

        if (response.status == 200 || response.status == 201) {
          console.log(`PUT replace order individual API for accountUsername: ${accountUsername} completed.`);


          let all_trading_accounts_list = [];
          all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, authToken: authToken });

          // Get latest order id for all trading accounts
          let result_promise_replace_order_status = [true];
          const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_replace_order_status);

          // Get latest order information for all trading accounts 
          const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_replace_order_status, orderId_list)

          // get all accountName of particular agentID
          let result = await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionIDAndAccountId(agentID, agentTradingSessionID, accountId);
          if (result.success != true) {
            return { success: false, data: result.error };
          }
          const accountDocument = result.data;

          // replace order will create new orderId, thus agentTradingSessionID increases by 1
          result = await agentDBOperation.searchAgentTradingSessionID(agentID);

          agentDocument = result.data;
          agentTradingSessionID = agentDocument.agentTradingSessionID + 1;

          // save orders for all trading accounts to copyTradingAccount table
          await createCopyTradingAccountItem_all_accounts(agentTradingSessionID, accountDocument, result_promise_order_information, result_promise_replace_order_status)
          
          result = await agentDBOperation.updateAgentTradingSessionID(
            agentID,
            agentTradingSessionID
          );
          if (result.success != true) {
            return { success: false, data: result.error };
          }

          return { success: true, data: "success" };
        } else {
          console.log(`PUT replace order individual API for accountUsername: ${accountUsername} failed.`);
          return { success: false };
        }
    } else {
      console.log(`No token available for accountUsername: ${accountUsername}`)
      return { success: false };
    }
  } catch (error) {
    console.log(`Error in PUT replace order individual API for accountUsername: ${accountUsername}. Error: ${error.message}`);
    return { success: false };
  }
}


// Put replace order for all trading accounts
async function put_replace_order_all_accounts(all_trading_accounts_list, optionChainOrderIdList, payload) {
  const put_replace_order_api_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { agentID, accountId, accountName, accountUsername, optionChainOrderId, authToken } = api_data;
    //const optionChainOrderId = optionChainOrderIdList[index];

    const config = {
      method: 'put',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountId}/orders/${optionChainOrderId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      data: payload
    }
    const result = await replace_order(config, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(put_replace_order_api_requests);
    console.log('PUT replace order API requests completed.');
    return result_promise;
  } catch (error) {
    console.log(`Error in PUT replace order API requests completed. Error: ${error.message}`);
    return false;
  }
}

// Copy trading replace order
async function copy_trading_replace_order(httpRequest) {
  let {
    agentTradingSessionID, 
    allTradingAccountsOrderList, 
    optionChainSymbol, 
    optionChainInstruction, 
    optionChainOrderType, 
    optionChainQuantity, 
    optionChainPrice
  } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      // get all accountName of particular agentID
      let result = await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionID(agentID, agentTradingSessionID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const accountDocument = result.data;

      let all_trading_accounts_list = [];

      for (let index = 0; index < allTradingAccountsOrderList.length; index++) {
        let accountId = allTradingAccountsOrderList[index]["accountId"];
        let accountName = allTradingAccountsOrderList[index]["accountName"];
        let accountUsername = allTradingAccountsOrderList[index]["accountUsername"];
        let optionChainOrderId = allTradingAccountsOrderList[index]["optionChainOrderId"];
        let authToken = await get_access_token_from_cache(agentID, accountUsername);

        all_trading_accounts_list.push({ 
          agentID: agentID,
          accountId: accountId, 
          accountName: accountName,
          accountUsername: accountUsername, 
          optionChainOrderId: optionChainOrderId, 
          authToken: authToken 
        });
      }

      // replace order with all accounts of particular agent
      let payload = {
        "complexOrderStrategyType": "NONE",
        "orderType": optionChainOrderType,
        "session": "NORMAL",
        "price": optionChainPrice,
        "duration": "DAY",
        "orderStrategyType": "SINGLE",
        "orderLegCollection": [
          {
            "instruction": optionChainInstruction,
            "quantity": optionChainQuantity,
            "instrument": {
              "symbol": optionChainSymbol,
              "assetType": "OPTION"
            }
          }
        ]
      }

      // PUT replace order for all trading accounts
      const result_promise_replace_order = await put_replace_order_all_accounts(all_trading_accounts_list, payload);

      // sync order and save to copy trading table for all trading accounts
      await sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID)

      let result_promise_make_order_status = [];
      for (let index = 0; index < result_promise_replace_order.length; index++) {
        const replace_order_success = result_promise_replace_order[index];
        if (replace_order_success == true) {
          result_promise_make_order_status.push(true);
        } else {
          result_promise_make_order_status.push(false);
        }
      }

      // Get latest order id for all trading accounts
      const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_make_order_status);

      // Get latest order information for all trading accounts 
      const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list);

      // replace order will create new orderId, thus agentTradingSessionID increases by 1
      result = await agentDBOperation.searchAgentTradingSessionID(agentID);

      agentDocument = result.data;
      agentTradingSessionID = agentDocument.agentTradingSessionID + 1;

      // save orders for all trading accounts to copyTradingAccount table
      await createCopyTradingAccountItem_all_accounts(agentTradingSessionID, result_promise_order_information, result_promise_make_order_status)
      
      result = await agentDBOperation.updateAgentTradingSessionID(
        agentID,
        agentTradingSessionID
      );
      if (result.success != true) {
        return { success: false, data: result.error };
      }


      return { success: true, data: "success" };
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}


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

// Delete cancel order for individual trading account
async function copy_trading_delete_cancel_order_individual(httpRequest) {

  let { agentTradingSessionID, accountId, accountUsername, optionChainOrderId } = httpRequest.body;

  try {
    const { token } = httpRequest.cookies;
    if (token) {
        let agentDocument = jwt.verify(token, jwtSecret, {});
        const agentID = agentDocument.id;
        
        let authToken = await get_access_token_from_cache(agentID, accountUsername);

        const config = {
          method: 'delete',
          maxBodyLength: Infinity,
          url: `https://api.tdameritrade.com/v1/accounts/${accountId}/orders/${optionChainOrderId}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        }

        const response = await axios.request(config);
        console.log(`Successful cancel order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)

        // sync order and save to copy trading table for all trading accounts
        await sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID)
        
        if (response.status == 200 || response.status == 201) {
          console.log(`DELETE cancel order individual API for accountUsername: ${accountUsername} completed.`);
          return { success: true, data: "success" };
        } else {
          console.log(`DELETE cancel order individual API for accountUsername: ${accountUsername} failed.`);
          return { success: false };
        }
    } else {
      console.log(`No token available for accountUsername: ${accountUsername}`)
      return { success: false };
    }
  } catch (error) {
    console.log(`Error in DELETE cancel order individual API for accountUsername: ${accountUsername}. Error: ${error.message}`);
    return { success: false };
  }
}

// Delete cancel order for all trading accounts
async function delete_cancel_order_all_accounts(all_trading_accounts_list, optionChainOrderIdList) {
  const delete_cancel_order_api_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { agentID, accountId, accountName, accountUsername, optionChainOrderId, authToken } = api_data;
    //const optionChainOrderId = optionChainOrderIdList[index];

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
      let result = await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionID(agentID, agentTradingSessionID);
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
      result = await copyTradingAccountDBBOperation.getAllOrderID(agentID, agentTradingSessionID);
      let all_trading_accounts_order_list = result.data;
      const optionChainOrderIdList = [];
      for(let index = 0; index < all_trading_accounts_order_list.length; index++) {
        optionChainOrderIdList.push(all_trading_accounts_order_list[index]["optionChainOrderId"]);
      }
      
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
    copy_trading_exit_order,
    copy_trading_replace_order,
    copy_trading_put_replace_order_individual,
    copy_trading_cancel_order,
    copy_trading_delete_cancel_order_individual
};
