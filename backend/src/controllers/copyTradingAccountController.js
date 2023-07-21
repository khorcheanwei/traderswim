const axios = require('axios');
const jwt = require("jsonwebtoken");

var Memcached = require('memcached-promise');
var copy_trading_account_cache = new Memcached('127.0.0.1:11211', {maxExpiration: 2592000});

const jwtSecret = "traderswim";

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
  tradeHistoryDBOperation,
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
      const accountPassword = accountDocument[0]["accountPassword"];
      await puppeteer_login_account(agentID, accountUsername, accountPassword);
      const authToken = await get_access_token_from_cache(agentID, accountUsername);

      if (authToken != null) {
        let config = {
          maxBodyLength: Infinity,
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }

        const response = await axios.get(`https://api.tdameritrade.com/v1/marketdata/chains?symbol=${stockName}&contractType=${optionChainCallPut}`, headers = config)
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
    if (response.status == 200 || response.status == 201) {
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
async function get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_make_order_status) {
  const get_latest_order_id_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const promise_make_order = result_promise_make_order_status[index];

    if (promise_make_order == false) {
      return null;
    }

    const { agentID, accountId, accountName, accountUsername, optionChainOrderId, authToken } = api_data;

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
async function get_latest_order_information(config, agentID, accountId, accountName, accountUsername, orderId) {

  try {
    const response = await axios.request(config);
    const current_order = response.data;

    let current_agentID = agentID;
    let current_accountId = accountId;
    let current_accountName = accountName;
    let current_accountUsername = accountUsername;
    let current_symbol = current_order["orderLegCollection"][0]["instrument"]["symbol"];
    let current_description = current_order["orderLegCollection"][0]["instrument"]["description"];
    let current_orderId = orderId;
    let current_orderType = current_order["orderType"];
    let current_instruction = current_order["orderLegCollection"][0]["instruction"];
    let current_price = current_order["price"];
    let current_quantity = current_order["quantity"];
    let current_optionChainFilledQuantity = current_order["filledQuantity"]
    let current_status = current_order["status"];
    let current_enteredTime = current_order["enteredTime"];
    if (current_order["closeTime"] != undefined) {
      current_enteredTime = current_order["closeTime"];
    }
    console.log(`Successful get latest order information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)

    return {agentID: current_agentID, accountId: current_accountId, accountName: current_accountName, accountUsername: current_accountUsername,
      optionChainSymbol: current_symbol, optionChainDescription: current_description, optionChainOrderId: current_orderId, optionChainOrderType: current_orderType, 
      optionChainInstruction: current_instruction, optionChainPrice: current_price, optionChainQuantity: current_quantity, 
      optionChainFilledQuantity: current_optionChainFilledQuantity, optionChainStatus: current_status, optionChainEnteredTime: current_enteredTime}
      
  } catch (error) {
    console.log(`Failed get latest order information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return {agentID: null, accountId: null, accountName: null, accountUsername: null,
      optionChainSymbol: null, optionChainDescription: null, optionChainOrderId: null, optionChainOrderType: null, 
      optionChainInstruction: null, optionChainPrice: null, optionChainQuantity: null, 
      optionChainFilledQuantity: null, optionChainStatus: null, optionChainEnteredTime: null};
  }
}

// get latest order list information
async function get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list) {
  const get_latest_order_id_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const promise_make_order = result_promise_make_order_status[index];

    if (promise_make_order == false) {
      return null;
    }

    const { agentID, accountId, accountName, accountUsername, optionChainOrderId, authToken } = api_data;

    const orderId = orderId_list[index];
    const url = `https://api.tdameritrade.com/v1/accounts/${accountId}/orders/${orderId}`;
    let data = '';
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      data : data
    }
    const result = await get_latest_order_information(config, agentID, accountId, accountName, accountUsername, orderId);
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
async function createCopyTradingAccountItem_all_accounts(agentTradingSessionID, result_promise_order_information, result_promise_make_order_status) {
  const createCopyTradingAccountItem_requests = result_promise_order_information.map(async (order_information, index) => {

    const make_order_status = result_promise_make_order_status[index];

    if (make_order_status == false) {
      return { success: false, data: null };
    }

    result = await copyTradingAccountDBBOperation.createCopyTradingAccountItem(
          agentTradingSessionID,
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
    allTradingAccountsOrderList,
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
      const agentTradingSessionID = agentDocument.agentTradingSessionID + 1;

      // get all accountName of particular agentID
      let all_trading_accounts_list = [];

      // Place order all all active accounts
      if (allTradingAccountsOrderList.length == 0) {
        // get all accountName of particular agentID
        result = await accountDBOperation.searchAccountByAgentIDAndAccountTradingActive(agentID);
        if (result.success != true) {
          return { success: false, data: result.error };
        }
        const accountDocument = result.data;

        for (let index = 0; index < accountDocument.length; index++) {
          let accountId = accountDocument[index].accountId;
          let accountName = accountDocument[index].accountName;
          let accountUsername = accountDocument[index].accountUsername;
          let authToken = await get_access_token_from_cache(agentID, accountUsername);
                                        
          all_trading_accounts_list.push({ agentID: agentID, accountId: accountId, accountName: accountName, accountUsername: accountUsername, optionChainOrderId: null, authToken: authToken });
        }
      } else {
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
      }

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

      // Post place order for all trading accounts
      const result_promise_make_order_status = await post_place_order_all_accounts(all_trading_accounts_list, payload);

      // Get latest order id for all trading accounts
      const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_make_order_status);

      // Get latest order information for all trading accounts 
      const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list)

      // save orders for all trading accounts to copyTradingAccount table
      await createCopyTradingAccountItem_all_accounts(agentTradingSessionID, result_promise_order_information, result_promise_make_order_status)
     
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
    let result_promise_make_order_status = [];
    let orderId_list = [];

    let copy_trading_table_id_list = [];
    for (let index = 0; index < all_trading_accounts_order_list.length; index++) {
      let accountId = all_trading_accounts_order_list[index]["accountId"];
      let accountName = all_trading_accounts_order_list[index]["accountName"];
      let accountUsername = all_trading_accounts_order_list[index]["accountUsername"];
      let optionChainOrderId = all_trading_accounts_order_list[index]["optionChainOrderId"];
      let authToken = await get_access_token_from_cache(agentID, accountUsername);
                                    
      all_trading_accounts_list.push({ agentID: agentID,  accountId: accountId, accountName: accountName, accountUsername: accountUsername, optionChainOrderId: optionChainOrderId, authToken: authToken });

      // it can be confusing with this term `result_promise_make_order_status` in sync_order_and_save_to_copy_trading_database function
      result_promise_make_order_status.push(true);
      orderId_list.push(optionChainOrderId);

      const id = all_trading_accounts_order_list[index]["id"];
      copy_trading_table_id_list.push(id)
    }

    // Get latest order information for all trading accounts 
    const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list);

    // Update latest order information for all trading accounts to copy trading table
    copyTradingAccountDBBOperation.updateAllOrderInformation(copy_trading_table_id_list, result_promise_order_information)

  } catch (error) {
    return { success: false, data: error.message };
  }
}

// Copy trading order database for cron job 
async function copy_trading_database_by_agent(agentID) {
  try {
    // get agent trading sessionID
    let result = await agentDBOperation.searchAgentTradingSessionID(agentID);
    if (result.success != true) {
      return { success: false, data: result.error };
    }
    agentDocument = result.data;
    let agentTradingSessionIDList =  await copyTradingAccountDBBOperation.getAllAgentTradingSessionIDBasedOptionChainStatus(agentID)

    for (let index = 0; index < agentTradingSessionIDList.data.length; index++) {
      let currAgentTradingSessionID = agentTradingSessionIDList.data[index]["agentTradingSessionID"];
      // sync order and save to copy trading table for all trading accounts
      await sync_order_and_save_to_copy_trading_database(agentID, currAgentTradingSessionID);
    }
    
    // get CopyTradingAccount based on agentID and agentTradingSessionID
    result =
      await copyTradingAccountDBBOperation.searchCopyTradingAccountBasedAgentID(
        agentID
      );

    if (result.success != true) {
      return { success: false, data: result.error };
    }
    const copyTradingAccountDocument = result.data;

    let copyTradingOrderDataDict = {};
    for (let index = 0; index < copyTradingAccountDocument.length; index++) {
      const currCopyTradingAccount = copyTradingAccountDocument[index];
      const optionChainEnteredTime = currCopyTradingAccount["optionChainEnteredTime"];

      const agentTradingSessionID = currCopyTradingAccount["agentTradingSessionID"];

      const currCopyTradingAccountData = {
        agentTradingSessionID: agentTradingSessionID,
        accountId: currCopyTradingAccount["accountId"],
        accountName: currCopyTradingAccount["accountName"],
        accountUsername: currCopyTradingAccount["accountUsername"],
        optionChainEnteredTime: optionChainEnteredTime.substring(0, optionChainEnteredTime.length - 5),
        optionChainInstruction: currCopyTradingAccount["optionChainInstruction"],
        optionChainQuantity: currCopyTradingAccount["optionChainQuantity"],
        optionChainFilledQuantity: currCopyTradingAccount["optionChainFilledQuantity"],
        optionChainSymbol: currCopyTradingAccount["optionChainSymbol"],
        optionChainDescription: currCopyTradingAccount["optionChainDescription"],
        optionChainOrderId: currCopyTradingAccount["optionChainOrderId"],
        optionChainPrice: currCopyTradingAccount["optionChainPrice"],
        optionChainOrderType: currCopyTradingAccount["optionChainOrderType"],
        optionChainStatus: currCopyTradingAccount["optionChainStatus"],
      }

      if (copyTradingOrderDataDict.hasOwnProperty(agentTradingSessionID) == false) {
        copyTradingOrderDataDict[agentTradingSessionID] = [currCopyTradingAccountData]
      } else {
        copyTradingOrderDataDict[agentTradingSessionID].push(currCopyTradingAccountData);
      }
    }

    // save copyTradingOrderDataDict from cache
    let copyTradingOrderDataDict_key = agentID + "." + "copyTradingOrderDataDict";
    await copy_trading_account_cache.set(copyTradingOrderDataDict_key, copyTradingOrderDataDict, 3600)


    return copyTradingOrderDataDict;
  } catch (error) {
    console.log(copyTradingOrderDataDict);
    return null;
  }
}

// Copy trading database
async function copy_trading_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      agentID = agentDocument.id;

      // get copyTradingOrderDataDict from cache
      let copyTradingOrderDataDict_key = agentID + "." + "copyTradingOrderDataDict";
      let copyTradingOrderDataDict = await copy_trading_account_cache.get(copyTradingOrderDataDict_key);
  
      if(copyTradingOrderDataDict != undefined) {
        return { success: true, data: copyTradingOrderDataDict };
      }     
       
      copyTradingOrderDataDict = await copy_trading_database_by_agent(agentID);

      //await new Promise(resolve => setTimeout(resolve, 500)); 
      return { success: true, data: copyTradingOrderDataDict };
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
          await tradeHistoryDBOperation.searchTradeHistoryBasedAgentID(
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
  get_latest_order_id_all_accounts,
  get_latest_order_information_all_accounts,
  createCopyTradingAccountItem_all_accounts,
  copy_trading_place_order,
  copy_trading_database,
  copy_trading_history_database,
  sync_order_and_save_to_copy_trading_database,
  copy_trading_database_by_agent,
};