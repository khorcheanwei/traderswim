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

      const authToken = "Fy20VFr9sVO7dK+CV9g2xKJWDdQh9iztiCKxx/hGt/7Od4wxSmKeONqsI1TAQaYSSkv6FJrNr8Fa8950hxfp3PZmLp255fldegIceMI6BLe+f5r7RuHFkQpVlNPSMXasQZyIz2NaEh7nOKP0GTSnSuFMzSxwX0RRuoQtDtkZ7Fbb941dpp8uR0u0bROok/djmqZs+SHJnRNT0mrmOAR38QsPEgOQa+s/NVZ0z4LZMtJsrcrgDPiQA0wifqQ3d+RUJYQmo28zzmQ/s3YcOq74hHquSdtwiv4leyj+m6rs2t0fC5uLcephvphlWiF9ddoLA3ZWu461K4Fi/0T1idaLYLk1Fzzb3MsPivzbvDShuLQ4SMvWBMsctOIH/xvWaG4xPRc8XCFxMs/N2sB813wbx6wmDcybSND6VDGAV5ShjeXaK4cy+S0z0aoTKRpgg3FL4y0WUD42/sDDP8zn8HOV9sBlwmcVBJCm7bUcJyO3JZFX3evgtRlTuW+zYMjGAWN3c0yrLCFeriFP3u9e8ccRVHRWpvPa6wVXKHkpX100MQuG4LYrgoVi/JHHvl86xsfs6BFMvoE/qRr3eDx7xUzh4sMHLtMHWbxPmnezP/ZVIXOg+UbGSy7IlFbMUag21/XxVWSNgI5qhweN7ec8+qgUmc+Fxivt57X/kxoKatlkzB07kkUQedKobA/OLTKbRA0WHSatvQfNYMuy+7XQrVNgksq3UpDjF50joQ3oGB+pORK8GL7xk1lmKtTliLz1Tm2jbN0Ca2ERQFJbsU0N8DsbHX8xWY8X6C1V1D5ztP2XrdYR4cMnLvQB44YB3j3S5+ECfkApxPweyZxvPMiFx/1C6s62SWg80F34k2R8FbKfyVPVkqPiKfMi3LUAYz7PyTuHXETq4gASESZzJtSca7tEfsrDPWiNXVrfzlZBZQwworAU2kxhI5Ds1HiX9ZtB3TAgHJFsaxcuSsWPJq4yDCJPW/jdJrIhiTdIfZ5ezj7MlQ0TFmn+UCWU5CXi7wKu4f4UOA4EhOVNrJWGOoMp/ksZEEq+Tq3YwMcwiQPEj5Bv/2BpiTUaCealAsKKAZD7qL/ks6euLM5C2ECSQ7V1jPbRJsAOYHMOWx1R212FD3x19z9sWBHDJACbC00B75E";

      if (authToken != null) {
        let config = {
          maxBodyLength: Infinity,
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }

        const response = await axios.get(`https://api.tdameritrade.com/v1/marketdata/chains?symbol=${stockName}`, headers = config)
        console.log(`Successful in get option chain list`);
        return { success: true, data: response.data.putExpDateMap };
      } else {
        console.log(`Failed in get option chain list. No access token for agent ID ${agentID} and account username ${accountUsername}`);
        return { success: false, data: `No access token for agent ID ${agentID} and account username ${accountUsername}` };
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
    const { accountId, accountUsername, auth_token } = api_data;
    payload = {
      "complexOrderStrategyType": "NONE",
      "orderType": "LIMIT",
      "session": "NORMAL",
      "price": "1.45",
      "duration": "DAY",
      "orderStrategyType": "SINGLE",
      "orderLegCollection": [
        {
          "instruction": "BUY_TO_OPEN",
          "quantity": 1,
          "instrument": {
            "symbol": "TSLA_060923P20",
            "assetType": "OPTION"
          }
        }
      ]
    }
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
    console.error(`Failed pget latest order ID - accountUsername: ${accountUsername} with ${JSON.stringify(config)}. Error: ${error.message}`);
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

      
      for (let index = 0; index < accountDocument.length; index++) {
        let accountId = accountDocument[index].accountId;
        let accountUsername = accountDocument[index].accountUsername;
        let auth_token = "b72q2Q9zhDcHgUQ5iGFNRU3Qmhi0SvC5n4stBPp3VQdYAQrQ22C6LfFfZB3ng3usUysXM1orcdR3srtGMiT2Y9XoQMW8q35VS/CRBEnv6BNQ3RaCSAUUhBvLDEgf1qzdEWDV18GgfQpw5DYhqlPy4c7kxntXRyeZq8+ysT5x5CBdLZoHqWeZLtbbHFcnd5DZtwppCQUKSVBtrye5ZUvupHMd6gTb23JBcHiH7ulavQR/kFF5/Z1LLp2bjeTdfkxNZ/i3T6JDT7/uUTT2HTNHu2POffzYf49BvBSWF07ly5KmJK7Me7FpAyBYBVFZHgDhJ88lplz7ggGDs3QwdWMlAconsrMKmT8xc6ZL7cQ2MJmsqqkhotPsrktG0cmyVBZi0pa6B4Aut1ghy/Xf5tUStqcoOMmY9d19Ui8IpW7njYW59IjQLmS0/k9rMyXAIgDLRhKEaKAOVa4qxSBMMVcKJ6nEtr6AeCMvs9H3nPg3H1SoIj4ytvCSSPJezIPcm8ZImRdZ6uukWVBmzFq/Kk3CRKfXiG5100MQuG4LYrgoVi/JHHvlkhf661XVqXM3QR/RNKvFJJkr9/1duRvVgzh8yl+hhUJdaUGDRv2LHO6anIEslMT6ip5uE4vOSWr7ZEFI31D6rRnjJu7xOnb4Od/f1hXvLcMCP/saFJAJ0BEylxBMP+86ruBF9IZ9yrmXMIprAuC4QG56haR85GNlXi9hYaM9ShPB6EXpj/hW9cQKrNN2ZyJma3s9BUnhyWv9nzqg+p673rW9bZ9kzY7bjHwz5Ey+Kl002mVphiQFAJTU9eraPCNoDn+47RcNMopPDitl7Omer1fhogNNANIZkqlHlmeAS8Cod9zl0VXOWP+DZgf1NgriTytP/iZ40+UrrMyAnFYkmnSDYe3EUxRK2BVNYu7bytYa/kNDk08t20dLCcWV4G86+OvoRT4pSGJ38umQCHXIIo3Gfv0vglnoaWVZLTqu+XG9wXDe45GoIji50xHTLQKosUVD6mfNrBe3rMRqF8PhKJd0PWpXdkmeeaB/azBSO38QWxxB+QniDUFFFGPWRIUmTLW6q/y6VmSRyyLrfFL5JXqrKIQ=212FD3x19z9sWBHDJACbC00B75E";

        //let auth_token = await get_access_token_from_cache(agentID, accountUsername);
        all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, auth_token: auth_token })
      }
      /*
      for (let index = 0; index < 2; index++) {
        let accountId = accountDocument[0].accountId;
        let accountUsername = accountDocument[0].accountUsername;
        let auth_token = "DfBkBWI2mYhfAi/pGfPbeixsRu1DiH3mJ8DCWZkLjBncHbLemxbNkDgLtRg4KTAM6K5l7yUu7IQFG5rh0ZhmnKAAP70/Z1cLCsM9UwMlEwv3A0w0+s2MsdWyYR0q4wpNIV1qyO8d4YEDDb/HhN4x0TrdCyh0N7F8ZYlK9nXDOd1ossO2OyuXJqpdy+MHjtCOWAbouJCeWNmUrbDdjsSGrMZ++FK6LqjoX62WeUYbvXvwkqJ9d8kfuY3IF5ODyZdvpmq52BsQGiDtIdQHEKVYtBkw2EdpuUM8MoJ171J5PGC60KzLa+9NYoQTguVR/x/3oGGEAq0gBj4finy8AfPM6octq86otor0NGPnUwV5MNHKF0XZmV19I4GfbmSBGD5P6EksFaN3KxOoI1yec6cHxQGIjScX+zo8qzvOxBG98xwExrTX76W40/M5hZY9RYjj9EKPODFkE8mCyWzoq1SRkaQU3N+u/KHx7uXTptv7WcEgvoYMNPArJHMs1GMcw0+PbxtguRC3yjdCHfUVHR5YV9YGXxp100MQuG4LYrgoVi/JHHvlL/WgG5FtKePh+L5ynv7AxVA/RFRAWpLnnh+WrihTgxfL8agYZLaiAymSH0etDfkWlQ9BBwlVsv8ZvyQ8Ncs2fXPQgnG4ChEU4Kyu0BqhkcnY+w9x0Htv1mm4PTbVO53R54RFvlbOsblRZfr7ldKKOWhH1nKbWrlJLiyn/Ssuo4SPP4Q8nE5r4wEjQPDsfzkK9EyvEe4CwuRZGZcUPs9nCQIpDQ5nAjrd64y+D5togLP3qFsDrunT9QRQJqJ8LKDPRyeH5v/+SJPxAa7JIsAMvs7Ojqe98ByqyG4Mj54xOFMKEkFz7wo/epsfDqzEEgsdzpYGkAAdcfD1iy+bWL/d8fTYKzPhNPrRil++fbgOFJz5dcYvS+x89lTfKYuWVIr+OMimxz0lHvYWk3ZEqzAeV/cP7ecHiIhO6LgLlg+KYYKCIbXpLs+mvtAftaIc9YANbxsQTCIeK32rsrv9h4a6IHW64jtcinWA1vR/8bsXnwbs5KubiA8+2IDzBfs8nccxOLX11aRvszYsGAnhaITKXQxa300=212FD3x19z9sWBHDJACbC00B75E";

        //let auth_token = await get_access_token_from_cache(agentID, accountUsername);
        all_trading_accounts_list.push({ accountId: accountId, accountUsername: accountUsername, auth_token: auth_token })
      }*/

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
