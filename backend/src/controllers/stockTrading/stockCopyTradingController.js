const axios = require('axios');
const jwt = require("jsonwebtoken");

var Memcached = require('memcached-promise');
var stock_copy_trading_cache = new Memcached('127.0.0.1:11211', {maxExpiration: 2592000});

const jwtSecret = "traderswim";

const {
  agentDBOperation,
  accountDBOperation,
  stockCopyTradingDBOperation,
  stockTradeHistoryDBOperation,
} = require("../../data-access/index.js");

const { puppeteer_login_account, get_access_token_from_cache, fetch_trading_account_info_api } = require("./../tradingAccountPuppeteer.js")


// get quote stock information
async function stock_copy_trading_get_stock_quotes(httpRequest) {
  const { stockSymbol } = httpRequest.query;

  // when stock name is undefined
  if (stockSymbol == undefined || stockSymbol == '') {
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

        const response = await axios.get(`https://api.tdameritrade.com/v1/marketdata/${stockSymbol}/quotes`, headers = config)
        console.log(`Successful in get stock info`);
        return { success: true, data: response.data };
        
      } else {
        console.log(`Failed in get stock info. No access token for agent ID ${agentID}`);
        return { success: false, data: `Failed in get stock info. No access token for agent ID ${agentID}` };
      }
    } catch (error) {
      console.log(`Failed in get stock info. Error: ${error.message}`);
      return { success: false, data: error.message };
    }
  } else {
    console.log(`Failed in get stock info. No access cookies token.`);
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
    const { agentID, accountId, accountName, accountUsername, stockOrderId, authToken } = api_data;
        
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
    let current_session = current_order["session"];
    let current_duration = current_order["duration"];
    let current_orderId = orderId;
    let current_orderType = current_order["orderType"];
    let current_instruction = current_order["orderLegCollection"][0]["instruction"];
    let current_price = current_order["price"];
    let current_stockStopPrice = current_order['stopPrice'];
    let current_stockStopPriceLinkType = current_order['stockStopPriceLinkType'];
    let current_stockStopPriceOffset = current_order['stockStopPriceOffset'];
    let current_quantity = current_order["quantity"];
    let current_stockFilledQuantity = current_order["filledQuantity"]
    let current_status = current_order["status"];
    let current_enteredTime = current_order["enteredTime"];
    if (current_order["closeTime"] != undefined) {
      current_enteredTime = current_order["closeTime"];
    }
    console.log(`Successful get latest order information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Status: ${response.status}`)

    return {agentID: current_agentID, accountId: current_accountId, accountName: current_accountName, accountUsername: current_accountUsername,
      stockSymbol: current_symbol, session: current_session, duration: current_duration, stockOrderId: current_orderId, stockOrderType: current_orderType, 
      stockInstruction: current_instruction, stockPrice: current_price, stockStopPrice: current_stockStopPrice, stockStopPriceLinkType: current_stockStopPriceLinkType, stockStopPriceOffset:current_stockStopPriceOffset,
      stockQuantity: current_quantity, stockFilledQuantity: current_stockFilledQuantity, stockStatus: current_status, stockEnteredTime: current_enteredTime}
      
  } catch (error) {
    console.log(`Failed get latest order information - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return {agentID: null, accountId: null, accountName: null, accountUsername: null,
      stockSymbol: null, stockOrderId: null, stockOrderType: null, 
      stockInstruction: null, stockPrice: null, stockQuantity: null, 
      stockFilledQuantity: null, stockStatus: null, stockEnteredTime: null};
  }
}

// get latest order list information
async function get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list) {
  const get_latest_order_id_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const promise_make_order = result_promise_make_order_status[index];

    if (promise_make_order == false) {
      return null;
    }

    const { agentID, accountId, accountName, accountUsername, stockOrderId, authToken } = api_data;

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

// Save orders for all trading accounts to stockCopyTradingAccount table
async function createStockCopyTradingAccountItem_all_accounts(agentTradingSessionID, result_promise_order_information, result_promise_make_order_status) {
  const createCopyTradingAccountItem_requests = result_promise_order_information.map(async (order_information, index) => {

    const make_order_status = result_promise_make_order_status[index];

    if (make_order_status == false) {
      return { success: false, data: null };
    }

    result = await stockCopyTradingDBOperation.createStockCopyTradingItem(
          agentTradingSessionID,
          order_information,
    );

    return result;
  });

  try {
    const result_promise = await Promise.all(createCopyTradingAccountItem_requests);
    console.log('Save orders for all trading accounts to stockCopyTradingAccount table promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in save orders for all trading accounts to stockCopyTradingAccount table requests completed. Error: ${error.message}`);
    return null;
  }
}

function place_order_config(stockSymbol, stockSession, stockDuration, stockInstruction, stockOrderType, stockQuantity, 
  stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset) {

  let payload = {
    "orderType": stockOrderType,
    "session": stockSession,
    "duration": stockDuration,
    "orderStrategyType": "SINGLE",
    "orderLegCollection": [
        {
            "instruction": stockInstruction,
            "quantity": stockQuantity,
            "instrument": {
                "symbol": stockSymbol,
                "assetType": "EQUITY"
            }
        }
    ]
  }

  if (stockOrderType == "LIMIT") {
    payload["price"] = stockPrice;
  } else if (stockOrderType == "STOP") {
    payload["stopPrice"] = stockPrice;
  } else if (stockOrderType == "STOP_LIMIT") {
    payload["price"] = stockPrice;
    payload["stopPrice"] = stockStopPrice;
  } else if (stockOrderType == "TRAILING_STOP") {
    payload["stopPriceLinkBasis"] = "MARK",
    payload["stockStopPriceLinkType"] = stockStopPriceLinkType;
    payload["stockStopPriceOffset"] = stockStopPriceOffset;
  }
  return payload;
}


// Stock Copy trading place order
async function stock_copy_trading_place_order(httpRequest) {
  const {
    allTradingAccountsOrderList, 
    stockSymbol, 
    stockSession, 
    stockDuration, 
    stockInstruction, 
    stockOrderType, 
    stockQuantity, 
    stockPrice,
    stockStopPrice, 
    stockStopPriceLinkType, 
    stockStopPriceOffset
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

      // Place order on all active accounts
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
                        
          all_trading_accounts_list.push({ agentID: agentID, accountId: accountId, accountName: accountName, accountUsername: accountUsername, stockOrderId: null, authToken: authToken });
        }
      } else {
        for (let index = 0; index < allTradingAccountsOrderList.length; index++) {
          let accountId = allTradingAccountsOrderList[index]["accountId"];
          let accountName = allTradingAccountsOrderList[index]["accountName"];
          let accountUsername = allTradingAccountsOrderList[index]["accountUsername"];
          let stockOrderId = allTradingAccountsOrderList[index]["stockOrderId"];
          let authToken = await get_access_token_from_cache(agentID, accountUsername);
  
          all_trading_accounts_list.push({ 
            agentID: agentID,
            accountId: accountId, 
            accountName: accountName,
            accountUsername: accountUsername, 
            stockOrderId: stockOrderId, 
            authToken: authToken 
          });
        }
      }

      // place order with all accounts of particular agent
      let payload = place_order_config( 
                      stockSymbol, stockSession, stockDuration, stockInstruction, stockOrderType, 
                      stockQuantity, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset);

      // Post place order for all trading accounts
      const result_promise_make_order_status = await post_place_order_all_accounts(all_trading_accounts_list, payload);

      // Get latest order id for all trading accounts
      const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_make_order_status);

      // Get latest order information for all trading accounts 
      const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list)

      // save orders for all trading accounts to copyTradingAccount table
      await createStockCopyTradingAccountItem_all_accounts(agentTradingSessionID, result_promise_order_information, result_promise_make_order_status)
     
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
async function sync_order_and_save_to_stock_copy_trading_database(agentID, agentTradingSessionID) {
  try {
    // get all orderID for all trading accounts
    let result = await stockCopyTradingDBOperation.getAllOrderID(agentID, agentTradingSessionID);
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
      let stockOrderId = all_trading_accounts_order_list[index]["stockOrderId"];
      let authToken = await get_access_token_from_cache(agentID, accountUsername);
                                    
      all_trading_accounts_list.push({ agentID: agentID,  accountId: accountId, accountName: accountName, accountUsername: accountUsername, stockOrderId: stockOrderId, authToken: authToken });

      // it can be confusing with this term `result_promise_make_order_status` in sync_order_and_save_to_stock_copy_trading_database function
      result_promise_make_order_status.push(true);
      orderId_list.push(stockOrderId);

      const id = all_trading_accounts_order_list[index]["id"];
      copy_trading_table_id_list.push(id)
    }

    // Get latest order information for all trading accounts 
    const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_make_order_status, orderId_list);

    // Update latest order information for all trading accounts to copy trading table
    stockCopyTradingDBOperation.updateAllOrderInformation(copy_trading_table_id_list, result_promise_order_information)

  } catch (error) {
    return { success: false, data: error.message };
  }
} 

// Copy trading order database for cron job 
async function stock_copy_trading_database_by_agent(agentID) {
  try {
    // get agent trading sessionID
    let result = await agentDBOperation.searchAgentTradingSessionID(agentID);
    if (result.success != true) {
      return { success: false, data: result.error };
    }
    agentDocument = result.data;
    let agentTradingSessionIDList =  await stockCopyTradingDBOperation.getAllAgentTradingSessionIDBasedStockStatus(agentID)

    for (let index = 0; index < agentTradingSessionIDList.data.length; index++) {
      let currAgentTradingSessionID = agentTradingSessionIDList.data[index]["agentTradingSessionID"];
      // sync order and save to copy trading table for all trading accounts
      await sync_order_and_save_to_stock_copy_trading_database(agentID, currAgentTradingSessionID);
    }
    
    // get CopyTradingAccount based on agentID and agentTradingSessionID
    result =
      await stockCopyTradingDBOperation.searchStockCopyTradingBasedAgentID(
        agentID
      );

    if (result.success != true) {
      return { success: false, data: result.error };
    }
    const copyTradingAccountDocument = result.data;

    let stockCopyTradingOrderDataDict = {};
    for (let index = 0; index < copyTradingAccountDocument.length; index++) {
      const currCopyTradingAccount = copyTradingAccountDocument[index];
      const stockEnteredTime = currCopyTradingAccount["stockEnteredTime"];

      const agentTradingSessionID = currCopyTradingAccount["agentTradingSessionID"];

      const currCopyTradingAccountData = {
        agentTradingSessionID: agentTradingSessionID,
        accountId: currCopyTradingAccount["accountId"],
        accountName: currCopyTradingAccount["accountName"],
        accountUsername: currCopyTradingAccount["accountUsername"],
        stockEnteredTime: stockEnteredTime.substring(0, stockEnteredTime.length - 5),
        stockInstruction: currCopyTradingAccount["stockInstruction"],
        stockQuantity: currCopyTradingAccount["stockQuantity"],
        stockFilledQuantity: currCopyTradingAccount["stockFilledQuantity"],
        stockSymbol: currCopyTradingAccount["stockSymbol"],
        stockOrderId: currCopyTradingAccount["stockOrderId"],
        stockPrice: currCopyTradingAccount["stockPrice"],
        stockOrderType: currCopyTradingAccount["stockOrderType"],
        stockStatus: currCopyTradingAccount["stockStatus"],
      }

      if (stockCopyTradingOrderDataDict.hasOwnProperty(agentTradingSessionID) == false) {
        stockCopyTradingOrderDataDict[agentTradingSessionID] = [currCopyTradingAccountData]
      } else {
        stockCopyTradingOrderDataDict[agentTradingSessionID].push(currCopyTradingAccountData);
      }
    }

    // save stockCopyTradingOrderDataDict from cache
    let stockCopyTradingOrderDataDict_key = agentID + "." + "stockCopyTradingOrderDataDict";
    await stock_copy_trading_cache.set(stockCopyTradingOrderDataDict_key, stockCopyTradingOrderDataDict, 3600)


    return stockCopyTradingOrderDataDict;
  } catch (error) {
    console.log(stockCopyTradingOrderDataDict);
    return null;
  }
}

// Copy trading database
async function stock_copy_trading_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      agentID = agentDocument.id;

      // get stockCopyTradingOrderDataDict from cache
      let stockCopyTradingOrderDataDict_key = agentID + "." + "stockCopyTradingOrderDataDict";
      let stockCopyTradingOrderDataDict = await stock_copy_trading_cache.get(stockCopyTradingOrderDataDict_key);
  
      if(stockCopyTradingOrderDataDict != undefined) {
        return { success: true, data: stockCopyTradingOrderDataDict };
      }     
       
      stockCopyTradingOrderDataDict = await stock_copy_trading_database_by_agent(agentID);

      //await new Promise(resolve => setTimeout(resolve, 500)); 
      return { success: true, data: stockCopyTradingOrderDataDict };
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}


// copy trading history database
async function stock_copy_trading_history_database(httpRequest) {
  const { token } = httpRequest.cookies;

  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      agentID = agentDocument.id;

      try {
        // get CopyTradingAccount based on agentID and agentTradingSessionID
        const result =
          await stockTradeHistoryDBOperation.searchStockTradeHistoryBasedAgentID(
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
            stockEnteredTime: currCopyTradingAccount.stockEnteredTime,
            stockInstruction: currCopyTradingAccount.stockInstruction,
            stockQuantity: currCopyTradingAccount.stockQuantity,
            stockFilledQuantity: currCopyTradingAccount.stockFilledQuantity,
            stockPrice: currCopyTradingAccount.stockPrice,
            stockOrderType: currCopyTradingAccount.stockOrderType,
            stockStatus: currCopyTradingAccount.stockStatus,
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
    stock_copy_trading_get_stock_quotes,
    get_latest_order_id_all_accounts,
    get_latest_order_information_all_accounts,
    createStockCopyTradingAccountItem_all_accounts,
    sync_order_and_save_to_stock_copy_trading_database,
    stock_copy_trading_place_order,
    stock_copy_trading_database,
    stock_copy_trading_database_by_agent,
    stock_copy_trading_history_database
};