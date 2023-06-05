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

// get option chain list
async function copy_trading_get_option_chain_list(httpRequest) {
  const { stockName, optionChainCallPut } = httpRequest.query;

  // when stock name is undefined
  if (stockName == undefined || stockName == '') {
    return { success: true, data: null };
  }

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      const result = await accountDBOperation.searchAccountByAgentID(agentID);
      const accountDocument = result.data;
      if (accountDocument.length == 0) {
        return { success: false, data: `No account registered for this agent ID ${agentID}` }; 
      }

      const accountUsername = accountDocument[0]["accountUsername"];
      const authToken = await get_access_token_from_cache(agentID, accountUsername);

      if (authToken != null) {
        let config = {
          maxBodyLength: Infinity,
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }

        const response = await axios.get(`https://api.tdameritrade.com/v1/marketdata/chains?symbol=${stockName}`, headers = config)
        console.log(`Successful in get option chain list`);
        if (optionChainCallPut == "CALL") {
          return { success: true, data: response.data.callExpDateMap };
        } else {
          return { success: true, data: response.data.putExpDateMap };
        }
      } else {
        console.log(`Failed in get option chain list. No access token for agent ID ${agentID}`);
        return { success: false, data: `Failed in get option chain list. No access token for agent ID ${agentID}` };
      }
    } catch (error) {
      console.log(`Failed in get option chain list. Error: ${error.message}`);
      return { success: false, data: error.message };
    }
  } else {
    console.log(`Failed in get option chain list. No access cookies token.`);
    return { success: true, data: null };
  }
}

// place order
async function place_order(config, accountUsername) {
  try {
    const response = await axios.request(config);
    console.log(`Successful place order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    if (response.status) {
      return true;
    } else {
      return false;
    }
    
  } catch (error) {
    console.log(`Failed place order - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return false;
  }
}

// Post place order for all trading accounts
async function post_place_order_all_accounts(all_trading_accounts_list, payload) {
  const post_place_order_api_requests = all_trading_accounts_list.map(async (api_data) => {
    const { accountId, accountUsername, authToken } = api_data;
    
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
    const result = await place_order(config, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(post_place_order_api_requests);
    console.log('POST place order API requests completed.');
    return result_promise;
  } catch (error) {
    console.log(`Error in POST place order API requests completed. Error: ${error.message}`);
    return null;
  }
}

// Get latest orderID 
async function get_latest_order_id(config, accountUsername) {
  
  let latest_order_id = null;
  try {
    const response = await axios.request(config)

    let total_orders = response.data["securitiesAccount"]["orderStrategies"].length;
    let latest_enteredTime = null;
    let latest_index = 0;

    for (let index = 0; index < total_orders; index++) {
      let current_enteredTime = response.data["securitiesAccount"]["orderStrategies"][index]["enteredTime"];
      if (latest_enteredTime == null) {
        latest_enteredTime = current_enteredTime;
      } else {

        if (latest_enteredTime < current_enteredTime) {
          latest_enteredTime = current_enteredTime;
          latest_index = index;
        }
      }
    }

    latest_order_id = response.data["securitiesAccount"]["orderStrategies"][latest_index]["orderId"];
    console.log(`Successful get latest order ID - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    return latest_order_id;
  } catch (error) {
    console.error(`Failed get latest order ID - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return latest_order_id;
  }
}

// Get latest orderID  for all trading accounts
async function get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_place_order) {
  const get_latest_order_id_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const promise_place_order = result_promise_place_order[index];

    if (promise_place_order == false) {
      return null;
    }

    const { accountId, accountUsername, authToken } = api_data;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        'fields': 'orders'
      }
    }
    const result = await get_latest_order_id(config, accountUsername);
    return result;
  });

  try {
    const result_promise = await Promise.all(get_latest_order_id_requests);
    console.log('Get latest orderID for all trading accounts promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in get latest orderID  for all trading accounts promise requests completed. Error: ${error.message}`);
    return null;
  }
}

// get latest order list information
async function get_latest_order_information(config, accountUsername, orderId) {

  try {
    const response = await axios.request(config);
    const order_list = response.data;

    for (let index = 0; index < order_list.length; index++) {
      const current_order = order_list[index];
      const current_orderId = current_order["orderId"];
      if (orderId == current_orderId) {
        const current_accountId = current_order["accountId"];
        const current_symbol = current_order["orderLegCollection"][0]["instrument"]["symbol"];
        const current_description = current_order["orderLegCollection"][0]["instrument"]["description"];
        const current_orderId = current_order["orderId"];
        const current_orderType = current_order["orderType"];
        const current_instruction = current_order["orderLegCollection"][0]["instruction"];
        const current_price = current_order["price"];
        const current_quantity = current_order["quantity"];
        const current_optionChainFilledQuantity = current_order["filledQuantity"]
        const current_status = current_order["status"];
        const current_enteredTime = current_order["enteredTime"];
        
        return {accountId: current_accountId, optionChainSymbol: current_symbol, optionChainDescription: current_description,
          optionChainOrderId: current_orderId, optionChainOrderType: current_orderType, optionChainInstruction: current_instruction,
          optionChainPrice: current_price, optionChainQuantity: current_quantity, optionChainFilledQuantity: current_optionChainFilledQuantity,
          optionChainStatus: current_status, optionChainEnteredTime: current_enteredTime}
      }
    }
    console.log(`Successful get latest order information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)
    return {accountId: null, optionChainSymbol: null, optionChainDescription: null, optionChainOrderId: null, optionChainOrderType: null, optionChainInstruction: null, optionChainPrice: null, optionChainQuantity: null, optionChainFilledQuantity: null, optionChainStatus: null, optionChainEnteredTime: null};

  } catch (error) {
    console.log(`Failed get latest order information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return {accountId: null, optionChainSymbol: null, optionChainDescription: null, optionChainOrderId: null, optionChainOrderType: null, optionChainInstruction: null, optionChainPrice: null, optionChainQuantity: null, optionChainFilledQuantity: null, optionChainStatus: null, optionChainEnteredTime: null};
  }
}

// get latest order list information
async function get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_place_order, orderId_list) {
  const get_latest_order_id_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const promise_place_order = result_promise_place_order[index];

    if (promise_place_order == false) {
      return null;
    }

    const { accountId, accountUsername, authToken } = api_data;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        'accountId': accountId
      }
    }

    const orderId = orderId_list[index];
    const result = await get_latest_order_information(config, accountUsername, orderId);
    return result;
  });

  try {
    const result_promise = await Promise.all(get_latest_order_id_requests);
    console.log('Get latest order information for all trading accounts promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in get latest order information for all trading accounts promise requests completed. Error: ${error.message}`);
    return null;
  }
}


// Save orders for all trading accounts to copyTradingAccount table
async function createCopyTradingAccountItem_all_accounts(agentTradingSessionID, accountDocument, result_promise_order_information, result_promise_place_order) {
  const createCopyTradingAccountItem_requests = result_promise_order_information.map(async (order_information, index) => {

    const promise_place_order = result_promise_place_order[index];

    if (promise_place_order == false) {
      return { success: false, data: null };
    }

    const accountDocumentPart = accountDocument[index];
    result = await copyTradingAccountDBBOperation.createCopyTradingAccountItem(
          agentTradingSessionID,
          accountDocumentPart,
          order_information,
    );

    return result;
  });

  try {
    const result_promise = await Promise.all(createCopyTradingAccountItem_requests);
    console.log('Save orders for all trading accounts to copyTradingAccount table promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in save orders for all trading accounts to copyTradingAccount table requests completed. Error: ${error.message}`);
    return null;
  }
}


// Copy trading place order
async function copy_trading_place_order(httpRequest) {
  const {
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
      // get agent trading sessionID
      let result = await agentDBOperation.searchAgentTradingSessionID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }

      agentDocument = result.data;
      const agentTradingSessionID = agentDocument.agentTradingSessionID;

      // get all accountName of particular agentID
      result = await accountDBOperation.searchAccountByAgentID(agentID);
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const accountDocument = result.data;

      // place order with all accounts of particular agent
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

      let all_trading_accounts_list = [];

      
      for (let index = 0; index < accountDocument.length; index++) {
        let accountId = accountDocument[index].accountId;
        let accountUsername = accountDocument[index].accountUsername;
        let authToken = await get_access_token_from_cache(agentID, accountUsername);

        all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, authToken: authToken })
      }
    
      // Post place order for all trading accounts
      const result_promise_place_order = await post_place_order_all_accounts(all_trading_accounts_list, payload);

      // Get latest order id for all trading accounts
      const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_place_order);

      // Get latest order information for all trading accounts 
      const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_place_order, orderId_list)

      // save orders for all trading accounts to copyTradingAccount table
      await createCopyTradingAccountItem_all_accounts(agentTradingSessionID, accountDocument, result_promise_order_information, result_promise_place_order)
      

      /*
      result = await agentDBOperation.updateAgentTradingSessionID(
        agentID,
        agentTradingSessionID
      );
      if (result.success != true) {
        return { success: false, data: result.error };
      }
      */

      // save agentTradingSessionID and agentIsTradingSession to table Agent
      return { success: true, data: "success" };
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

// sync order and save to copy trading table for all trading accounts
async function sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID) {
  try {
    // get all orderID for all trading accounts
    let result = await copyTradingAccountDBBOperation.getAllOrderID(agentID, agentTradingSessionID);
    if (result.success != true) {
      return { success: false, data: result.error };
    }

    let all_trading_accounts_order_list = result.data;

    let all_trading_accounts_list = [];
    let result_promise_place_order = [];
    let orderId_list = [];

    let copy_trading_table_id_list = [];
    for (let index = 0; index < all_trading_accounts_order_list.length; index++) {
      let accountId = all_trading_accounts_order_list[index]["accountId"];
      let accountUsername = all_trading_accounts_order_list[index]["accountUsername"];
      let optionChainOrderId = all_trading_accounts_order_list[index]["optionChainOrderId"];
      let authToken = await get_access_token_from_cache(agentID, accountUsername);
      authToken = 1;
      all_trading_accounts_list.push({accountId: accountId,  accountUsername:accountUsername, authToken:authToken});

      // it can be confusing with this term `result_promise_place_order` in sync_order_and_save_to_copy_trading_database function
      result_promise_place_order.push(true);
      orderId_list.push(optionChainOrderId);

      const id = all_trading_accounts_order_list[index]["id"];
      copy_trading_table_id_list.push(id)
    }

    // Get latest order information for all trading accounts 
    const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_place_order, orderId_list);

    // Update latest order information for all trading accounts to copy trading table
    copyTradingAccountDBBOperation.updateAllOrderInformation(agentID, agentTradingSessionID, copy_trading_table_id_list, result_promise_order_information)

  } catch (error) {
    return { success: false, data: error.message };
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

      // sync order and save to copy trading table for all trading accounts
      await sync_order_and_save_to_copy_trading_database(agentID, agentTradingSessionID)

      // get CopyTradingAccount based on agentID and agentTradingSessionID
      result =
        await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedTradingSessionID(
          agentID,
          agentTradingSessionID
        );

      if (result.success != true) {
        return { success: false, data: result.error };
      }
      const copyTradingAccountDocument = result.data;

      let copyTradingAccountData = [];
      for (let index = 0; index < copyTradingAccountDocument.length; index++) {
        const currCopyTradingAccount = copyTradingAccountDocument[index];
        copyTradingAccountData.push({
          accountName: currCopyTradingAccount.accountName,
          accountUsername: currCopyTradingAccount.accountUsername,
          optionChainEnteredTime: currCopyTradingAccount.optionChainEnteredTime,
          optionChainInstruction: currCopyTradingAccount.optionChainInstruction,
          optionChainQuantity: currCopyTradingAccount.optionChainQuantity,
          optionChainFilledQuantity: currCopyTradingAccount.optionChainFilledQuantity,
          optionChainDescription: currCopyTradingAccount.optionChainDescription,
          optionChainPrice: currCopyTradingAccount.optionChainPrice,
          optionChainOrderType: currCopyTradingAccount.optionChainOrderType,
          optionChainStatus: currCopyTradingAccount.optionChainStatus,
        });
      }

      //await new Promise(resolve => setTimeout(resolve, 500)); 
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
            optionChainEnteredTime: currCopyTradingAccount.optionChainEnteredTime,
            optionChainInstruction: currCopyTradingAccount.optionChainInstruction,
            optionChainQuantity: currCopyTradingAccount.optionChainQuantity,
            optionChainFilledQuantity: currCopyTradingAccount.optionChainFilledQuantity,
            optionChainDescription: currCopyTradingAccount.optionChainDescription,
            optionChainPrice: currCopyTradingAccount.optionChainPrice,
            optionChainOrderType: currCopyTradingAccount.optionChainOrderType,
            optionChainStatus: currCopyTradingAccount.optionChainStatus,
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
  copy_trading_get_option_chain_list,
  copy_trading_place_order,
  copy_trading_database,
  copy_trading_history_database,
};
