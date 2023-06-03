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
  const { stockName } = httpRequest.query;

  // when stock name is undefined
  if (stockName == undefined || stockName == '') {
    return { success: true, data: null };
  }

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      const authToken = "toHX/1+aP5wi2k9D1vl0sDQ/Dkv9EWmG6Ba3VUFQkCXjHAmC8l6TppnMbRjqhjpGhEGEYSDWmaPWsGloxd4z4VwrNVHeeNQWqicyPgxU9iNigCJK9ygaU8fBAvi3Q9dRG5spY4C6Mq6Nqjin8GEnObv3/0VoRpceXarecgJcbmgorNqvAoVOUFEjKd1xYCtbo5aJ3makwo5wexThObxfJ6V3TZj2jxNvwKig4ZBoAXSdX7ktv3nf6oHSmyznX1bkXx422EF2GY07kqlx+s6OAkKv5AeBiPB6aN5MrfWtPVkKFpFVJ/hI8UqwouIRnzDisPFcTSrhLp0ir1Pi23RTGsx0967sRSgJrUhe6GM1kmnH8AG2YWF0QbVinO9K+xk58XvUwHyGqXjXUWHfbzW4KxsmIz4qnN6z46XfZTyr2qYIDCvppYcLngIdfJDzzGq3BD2Uu7Odr8TGsjUauVH9KsSPKZSrfGRZtKKaszSQJ4TaZQCviQ0Jw0/7YENdP0YhgHP8mnjKiQHY2bxxX/HBiE4u6bm100MQuG4LYrgoVi/JHHvl6fKgIO5PaDJe3Emy2EomjsbzmlfmdCkWFESBdCHnl2LLGkZ9+CmQM1IzDR3Q9K3Cy34Xjpu8jodLS0oRzMY5LIGCjDo23cuOXeFIB++KpFC1fuIyJph7Vlt/YWCmUsmNngcNirDTGUBXBruQKTHYcvvqpFx/qPZbXJGoAhNI2cQOWn2fOXucuPTKchfesT4I6686sVd4IbkpXSLx3gsNDb3SS4Pmkn/bzfn3UthttQCkaU8R0gzaLhalDBR09nr7kqDan7tjswuIvWlftk+DowC4RGKUDhbGkCpZHtfw+I0g5vewYzAGYR6eK3EMbA307yjLcvWEXo7cLguIipRIiucaRr73HSPNToY5+SRS1yB+0O0d+x/b306qV9T42/KPSlp2ta/ta7EGB/iP6pmQ+/EjxzB8EN5kncI4E8T3I11lpbo/Rl+IgiEcnQ6w+1l0xoCTqONY5agDFx2+FeRVApjL1kWhLTMazv64Etm+0vv6XVEsx4dFAGJx4z+hIM8uv8Kny0u0LH5PUjOmyg/lhwHiFpU=212FD3x19z9sWBHDJACbC00B75E";

      if (authToken != null) {
        let config = {
          maxBodyLength: Infinity,
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }

        const response = await axios.get(`https://api.tdameritrade.com/v1/marketdata/chains?symbol=${stockName}`, headers = config)
        return { success: true, data: response.data.putExpDateMap };
      } else {
        console.log(`No access token for agent ID ${agentID} and account username ${accountUsername}`);
        return { success: false, data: `No access token for agent ID ${agentID} and account username ${accountUsername}` };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
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
    const { accountId, accountUsername, auth_token } = api_data;
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountId}/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
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
    console.log(`Error in POST place order API requests completed ${error.message}`);
    return null;
  }
}

// Get latest orderID 
async function get_latest_order_id(config, accountUsername, promise_place_order) {
  if (promise_place_order == false) {
    return null;
  }
  
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
    console.error(`Failed pget latest order ID - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
    return latest_order_id;
  }
}

// Get latest orderID  for all trading accounts
async function get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_place_order) {
  const get_latest_order_id_requests = all_trading_accounts_list.map(async (api_data, index) => {
    const { accountId, accountUsername, auth_token } = api_data;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountId}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      },
      params: {
        'fields': 'orders'
      }
    }
    const promise_place_order = result_promise_place_order[index];
    const result = await get_latest_order_id(config, accountUsername, promise_place_order);
    return result;
  });

  try {
    const result_promise = await Promise.all(get_latest_order_id_requests);
    console.log('Get latest orderID for all trading accounts promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in get latest orderID  for all trading accounts promise requests completed ${error.message}`);
    return null;
  }
}

// get latest order list information
async function get_latest_order_information(config, accountUsername, promise_place_order, orderId) {

  if (promise_place_order == false) {
    return null;
  }

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
    const { accountId, accountUsername, auth_token } = api_data;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      },
      params: {
        'accountId': accountId
      }
    }
    const promise_place_order = result_promise_place_order[index];
    const orderId = orderId_list[index];
    const result = await get_latest_order_information(config, accountUsername, promise_place_order, orderId);
    return result;
  });

  try {
    const result_promise = await Promise.all(get_latest_order_id_requests);
    console.log('Get latest order information for all trading accounts promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in get latest order information for all trading accounts promise requests completed ${error.message}`);
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
      const agentTradingSessionID = agentDocument.agentTradingSessionID + 1;

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

      /*
      for (let index = 0; index < accountDocument.length; index++) {
        let accountId = accountDocument[index].accountId;
        let accountUsername = accountDocument[index].accountUsername;
        let auth_token = "MX3x8WdHH6v1y1QN4cUfIihiFJ4435rgwtdP+diS+1YzwJi+6Heg+AnNE8RbLVNnM84/T8ZbepyLVBeyL3oEcASzM6RjT5HsxFc9qGM8XRjc38JGWIJ92RGEv3VyZBIXzJg6xzaInAoBLttA5Kqqd2neIrZK+hVPkGFMyM9fSvps523YIs9ttuUBphrv7RbJkxifb6sGNjPGTRM1VOvuvl4ciZ9vn5GLh8P+qXtjZK8ElokB745T645VAgKvX+YQCtAoUKGlyppgd5YGur2nMeBLXeTEBixH/49fGS8knVytr5FwOQYfQfkQFh0f+sfRGZdIQzIciAWu0Z1zD63DIXKWWli6llRuUK/ZVApdmPVIY9AJlY+lg81CFIfmsFrRiBgDk2qkUz5corFDSiqlDz9P9ZKJuNlC+GlZBvMWW3qQKxx3ZxF5tqawDc92CmfrmOZwKUwTwXE0/z+5q8yg50z51ygT4TaeUSjwWdM6jCUmlPpoLwJTVrkZwFXWQaBVwnkNQvTi1NPKPxG3tz0RkdYd/Ht100MQuG4LYrgoVi/JHHvlkoaPmKeZRozTl/DYyX4+1C9LJKBuWL41AJp7CyjsBFytldmAPRYup0HNiI0n1BbtQT9w3tRaZiIq7aoglrKcNXq0ieVNUDEsltgF48uVYPNjD5y5hbllWD7CfS0Dw87K/PS7ySXrlEgx30FP/czXN+uAWMswLdP643ljFzYIBQ7vDrVp60QjXLwdQBlTCo81BeBllOT4KXtyU/DSrph0KAdD9VkO1ckXHCLmC0goKJiWNAszEfBN467VCEPdbM0cHC8XVR/F0sAjHj+NggaEysRhTZY9Yln4oxIvDct1ABjHmH2MjSJ2P++dDVH6XfoXxXKsgM9MuaNY1WgCoVJ+BqKJOvragWqMhLBk4DeaNlBUPsZxmeo/Vxq1lTHw0FC98N3XCP2Xm3UR0QUKs9xRY5bjZwJaybr8VHOra0ZMb/ZkNM/rvlc8mOPDKR3wgsANjkD6oNuMcHdKwJaP9uSEvTKLjdc3niPhjnRm/LtSg4S4oIHRjF/WToiS8zzuLAZ3p6JoAfjEjbD90aLE7FT20Vddfgs=212FD3x19z9sWBHDJACbC00B75E";

        //let auth_token = await get_access_token_from_cache(agentID, accountUsername);
        all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, auth_token: auth_token })
      }*/
      for (let index = 0; index < 2; index++) {
        let accountId = accountDocument[0].accountId;
        let accountUsername = accountDocument[0].accountUsername;
        let auth_token = "toHX/1+aP5wi2k9D1vl0sDQ/Dkv9EWmG6Ba3VUFQkCXjHAmC8l6TppnMbRjqhjpGhEGEYSDWmaPWsGloxd4z4VwrNVHeeNQWqicyPgxU9iNigCJK9ygaU8fBAvi3Q9dRG5spY4C6Mq6Nqjin8GEnObv3/0VoRpceXarecgJcbmgorNqvAoVOUFEjKd1xYCtbo5aJ3makwo5wexThObxfJ6V3TZj2jxNvwKig4ZBoAXSdX7ktv3nf6oHSmyznX1bkXx422EF2GY07kqlx+s6OAkKv5AeBiPB6aN5MrfWtPVkKFpFVJ/hI8UqwouIRnzDisPFcTSrhLp0ir1Pi23RTGsx0967sRSgJrUhe6GM1kmnH8AG2YWF0QbVinO9K+xk58XvUwHyGqXjXUWHfbzW4KxsmIz4qnN6z46XfZTyr2qYIDCvppYcLngIdfJDzzGq3BD2Uu7Odr8TGsjUauVH9KsSPKZSrfGRZtKKaszSQJ4TaZQCviQ0Jw0/7YENdP0YhgHP8mnjKiQHY2bxxX/HBiE4u6bm100MQuG4LYrgoVi/JHHvl6fKgIO5PaDJe3Emy2EomjsbzmlfmdCkWFESBdCHnl2LLGkZ9+CmQM1IzDR3Q9K3Cy34Xjpu8jodLS0oRzMY5LIGCjDo23cuOXeFIB++KpFC1fuIyJph7Vlt/YWCmUsmNngcNirDTGUBXBruQKTHYcvvqpFx/qPZbXJGoAhNI2cQOWn2fOXucuPTKchfesT4I6686sVd4IbkpXSLx3gsNDb3SS4Pmkn/bzfn3UthttQCkaU8R0gzaLhalDBR09nr7kqDan7tjswuIvWlftk+DowC4RGKUDhbGkCpZHtfw+I0g5vewYzAGYR6eK3EMbA307yjLcvWEXo7cLguIipRIiucaRr73HSPNToY5+SRS1yB+0O0d+x/b306qV9T42/KPSlp2ta/ta7EGB/iP6pmQ+/EjxzB8EN5kncI4E8T3I11lpbo/Rl+IgiEcnQ6w+1l0xoCTqONY5agDFx2+FeRVApjL1kWhLTMazv64Etm+0vv6XVEsx4dFAGJx4z+hIM8uv8Kny0u0LH5PUjOmyg/lhwHiFpU=212FD3x19z9sWBHDJACbC00B75E";

        //let auth_token = await get_access_token_from_cache(agentID, accountUsername);
        all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, auth_token: auth_token })
      }

      // Post place order for all trading accounts
      const result_promise_place_order = await post_place_order_all_accounts(all_trading_accounts_list, payload);

      // Get latest order id for all trading accounts
      const orderId_list = await get_latest_order_id_all_accounts(all_trading_accounts_list, result_promise_place_order);

      // Get latest order information for all trading accounts 
      const result_promise_order_information = await get_latest_order_information_all_accounts(all_trading_accounts_list, result_promise_place_order, orderId_list)

      // save trading order to table copyTradingAccount
      result =
        await copyTradingAccountDBBOperation.createCopyTradingAccountItem(
          accountDocument,
          agentID,
          agentTradingSessionID,
          optionChainSymbol,
          optionChainInstruction,
          optionChainOrderType,
          optionChainPrice,
          optionChainQuantity
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
            currCopyTradingAccount.optionChainSymbol,
          entryPrice: currCopyTradingAccount.optionChainPrice,
          optionChainQuantity: currCopyTradingAccount.optionChainQuantity,
          optionChainFilledQuantity: currCopyTradingAccount.optionChainFilledQuantity,
          optionChainEnteredTime: currCopyTradingAccount.optionChainEnteredTime.toLocaleString("en-US"),
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
              currCopyTradingAccount.optionChainSymbol,
            entryPrice: currCopyTradingAccount.optionChainPrice,
            optionChainQuantity: currCopyTradingAccount.optionChainQuantity,
            optionChainFilledQuantity: currCopyTradingAccount.optionChainFilledQuantity,
            optionChainEnteredTime: currCopyTradingAccount.optionChainEnteredTime.toLocaleString("en-US"),
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
