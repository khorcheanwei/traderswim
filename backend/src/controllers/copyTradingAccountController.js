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

// place order
async function place_order(config) {
  try {

    const response = await axios.request(config)
    console.log(response);
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error; // Throw the error to be caught by Promise.all()
  }
}

// place order promise all with multiple accounts
async function post_place_order_multiple_account(post_place_order_list, payload) {
  const post_place_order_api_requests = post_place_order_list.map(async (api_data) => {
    const { accountID, auth_token } = api_data;
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://api.tdameritrade.com/v1/accounts/${accountID}/orders`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`
      },
      data: payload
    }
    await place_order(config);
  });

  try {
    await Promise.all(post_place_order_api_requests);
    console.log('All API requests completed.');
  } catch (error) {
    console.error(`Error in API requests: ${error.message}`);
  }
}

// get latest orderID 
async function get_latest_order_id(accountID, auth_token) {
  accountID = 220373070;
  auth_token = 'JXXvJB38M5kE69dvlyQomaSbgOLcE9RX6wh9H9/39Rx3CLJQXOb8s2qFVamMho9Tj9x5l/y1gQ3c2e1sb2bcby5p1aqhGM1lQXXbDfpuPCYpqBBpI8v5qOhSxMMfhM22NNO6dr8BJ8w9o2xq+RKa3X1+YuoDN5YCZYe5zb9Aj8XQxd0a25bmRaO05/PXh+hNJuQ4ivtyr9S2JTF/Gjhg+J6Tjna1yjeE/b6gvy9bBz+NpQZpWbRGMV2RFH97/23uekph4EOV/P6pgd4sieV2J1aIbHsvG2u3uAXNzwpGXspZhNevcgnuilScYeIt+ov+KVc3FS40GvHsSP35y0F0arp2RHth+2I0UTvyxGi8EJzE68CCi8JATpslmYOVRRVq9efEouWqX7uFNjOR1caCaZpz+wZ0Xq/3FEkXpaer84wv6NAodupOMsBUlpByhSxqfu6mzOfWkDy7+RKdkxMeoWkD/4zLNso3NmYRCD+omdOZv5Tz220fvPHIrNLIKjIR8/eFKXlybfZTvylYGdN+X9qqXo+100MQuG4LYrgoVi/JHHvl9avj8zNtBpB/oqOU41aIGjNUrGwt4HcGV/J937Dr59YB/WJ+FG8l27iC9Zk6ycC+7W55vg0MITOqcq8U/EKjEBjpDr/nvitGxHAghcoQu//3xNyFbc8VCrJiCMT2SFfaAKmg/EcqfEL5MKBacrLQ/hQe2AQa5jxO049wC0yuiXP/Y4QqWiBfdNxSy3kDBNAGtKYqlHJ0nUj9pC40X0O/WSG0T89PGjVBQSXPchv/tSmxrCHjKniK0DdoyXXvdbjaArewy1Rjf7mlbbgq8cmIB2Ib3Sgi5FaoG7XrhYY8+LWAhmSSJWP7TCSVrfdY+tkelEWhX43p37mo378BEQWn4fORMCXcGtDGznvgKh39q//vooQ8F10UYRpKl3nCBZ2NPmTVzzg9U2ADeccpDQsSVrYZxANztu3XJF9r9WOCvEpNmr0ut6PILFvlMgNuXE5PFWCfZSGIXMOdOXyDuzhnGRwZmNhrNhc/ybqLpKbHv5NVSflnGv7wB/K0POmX3pcfSbX+fFaGq6KnO64xTYFHu9c4Iiw=212FD3x19z9sWBHDJACbC00B75E';
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.tdameritrade.com/v1/accounts/${accountID}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    },
    params: {
      'fields': 'orders'
    }
  }

  try {
    const response = await axios.request(config)

    let total_orders = response.data["securitiesAccount"]["orderStrategies"].length;
    let latest_enteredTime = null;
    let latest_index = 0;

    for (let index = 0; index < total_orders; index++) {
      let current_enteredTime = response.data["securitiesAccount"]["orderStrategies"][index]["enteredTime"];
      console.log(current_enteredTime)
      if (latest_enteredTime == null) {
        latest_enteredTime = current_enteredTime;
      } else {

        if (latest_enteredTime < current_enteredTime) {
          latest_enteredTime = current_enteredTime;
          latest_index = index;
        }
      }
    }

    let get_latest_order_id = response.data["securitiesAccount"]["orderStrategies"][latest_index]["orderId"];
    return get_latest_order_id;
  } catch (error) {
    console.error(`Error get latest order ID for accountID ${accountID}, ${error}`);
  }
}

// get latest order information 
async function get_latest_order_information(accountID, auth_token, orderID) {
  accountID = 220373070;
  orderID = 6247118696;
  auth_token = 'LHhm2YNwWWGeL3cV5aHGWali6Lf9m7Uj8XUrxCqAoB2w1RPk4jSP/dmK9WRsO2DAvwj5+KJVRLlVtBRDQ+poai+7Qn9Lkk/6L2aYaxmakg1XCKcL4GKhJ2s5LD1vnMp7jNgRvxIuxHOta9NgsQid2JLzQWb/D+Dwls77R0uVuw6UHiWYa2gxdtMqnjzcoKkcIq4XLOpF9KCYxt2H8mkxUVYFqPQ3g1IPeVIRRfHaLKAYIuIHsA8mdFCjOO1/GargpAry7RTI4yldcg6VNI0LNmPeJyMdMwCyrjLaDEV69trcbvR9//bzrB/AH3CMfYjaD1X16hVlBsstnjQLa6dpedqhoUpvY2LzJxsiUWTJ5F7soLCaQdJ7rwBsNW9/71gjeJbQmWKaC2/bsHH195WKSK9Qrc8f1AaJWXK9r0+J+nFCQRxBEpp/eir6IdHjUkpfTjxm47lsM3LelsVhTvKGrU5DzYimDbR8Yd+eepkdHwlzcS+B/KvNrh5nHmw5EsGyta2ll4k/Z/Z60h28m+7fBuOJTMC100MQuG4LYrgoVi/JHHvlNt5vXhGfNcfkWJJ4SQewENyeP1VGOd0EDr03lPg03CRCDLpCp39nxRQggdTl9tHBOPzqDTHMJO6GeZhFJOWsWbyB51uHsWAA4wuupkkbe+o+HkzN5j70gf2GEp5ryIp+Vs66fEeM5Jw+ldITCZyUjkF+U/EbyWoIVOBDhoRVAWcEWBc47P4049k6oFYH1UHrxfsAWj4bBHhG/RgIOlmJQXr+pFGV+48kaldGj7+bCWW3RJbexmP5ZA2wgKlZyMu8W5p4CO6fXIMP3HjIEHRmHmBzgMPEYenVvPusb5CQr/UA46P086/C+h3BITySoX63jVNwocchMWRyPcakY/qNjUZy6m+WlXpFhO6n5h247wqKyPgGz5vD6hl7n2AjUvujIOgd9qgd5848AtgTzZvU3AbavFBC/YfhCAJ1WvVi3G4ooRsf4U/XOsQnV5908KNiszLsQVmcNzdyFF5hMxwn7g4zeKuJJu/0VH/q4TXfb345bOh+HH3l6C+76LbhyQQ4KY8PnR/SeEL8mR+ETm14VYu8Sjo=212FD3x19z9sWBHDJACbC00B75E';
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.tdameritrade.com/v1/orders`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    },
    params: {
      'accountId': accountID
    }
  }

  try {
    const response = await axios.request(config);
    const order_list = response.data;

    for (let index = 0; index < order_list.length; index++) {
      const current_order = order_list[index];
      const current_orderId = current_order.orderId;
      if (orderID == current_orderId) {
        const current_enteredTime = current_order.enteredTime;
        const current_filledQuantity = current_order.filledQuantity;
        const current_status = current_order.status;

        return { "enteredTime": current_enteredTime, "filledQuantity": current_filledQuantity, "status": current_status };
      }
    }
    return { "enteredTime": null, "filledQuantity": null, "status": null };

  } catch (error) {
    console.error(`Error get latest order ID for accountID ${accountID}, ${error}`);
    return { "enteredTime": null, "filledQuantity": null, "status": null };
  }
}


// Copy trading place order
async function copy_trading_place_order(httpRequest) {
  const {
    optionChainSymbol,
    optionChainAction,
    optionChainType,
    optionContractTotal,
    optionContractPrice,
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
        "orderType": optionChainType,
        "session": "NORMAL",
        "price": optionContractPrice,
        "duration": "DAY",
        "orderStrategyType": "SINGLE",
        "orderLegCollection": [
          {
            "instruction": optionChainAction,
            "quantity": optionContractTotal,
            "instrument": {
              "symbol": optionChainSymbol,
              "assetType": "OPTION"
            }
          }
        ]
      }


      let post_place_order_list = [];
      for (let index = 0; index < accountDocument.length; index++) {
        let accountID = accountDocument[index].accountID;

        let auth_token = "LHhm2YNwWWGeL3cV5aHGWali6Lf9m7Uj8XUrxCqAoB2w1RPk4jSP/dmK9WRsO2DAvwj5+KJVRLlVtBRDQ+poai+7Qn9Lkk/6L2aYaxmakg1XCKcL4GKhJ2s5LD1vnMp7jNgRvxIuxHOta9NgsQid2JLzQWb/D+Dwls77R0uVuw6UHiWYa2gxdtMqnjzcoKkcIq4XLOpF9KCYxt2H8mkxUVYFqPQ3g1IPeVIRRfHaLKAYIuIHsA8mdFCjOO1/GargpAry7RTI4yldcg6VNI0LNmPeJyMdMwCyrjLaDEV69trcbvR9//bzrB/AH3CMfYjaD1X16hVlBsstnjQLa6dpedqhoUpvY2LzJxsiUWTJ5F7soLCaQdJ7rwBsNW9/71gjeJbQmWKaC2/bsHH195WKSK9Qrc8f1AaJWXK9r0+J+nFCQRxBEpp/eir6IdHjUkpfTjxm47lsM3LelsVhTvKGrU5DzYimDbR8Yd+eepkdHwlzcS+B/KvNrh5nHmw5EsGyta2ll4k/Z/Z60h28m+7fBuOJTMC100MQuG4LYrgoVi/JHHvlNt5vXhGfNcfkWJJ4SQewENyeP1VGOd0EDr03lPg03CRCDLpCp39nxRQggdTl9tHBOPzqDTHMJO6GeZhFJOWsWbyB51uHsWAA4wuupkkbe+o+HkzN5j70gf2GEp5ryIp+Vs66fEeM5Jw+ldITCZyUjkF+U/EbyWoIVOBDhoRVAWcEWBc47P4049k6oFYH1UHrxfsAWj4bBHhG/RgIOlmJQXr+pFGV+48kaldGj7+bCWW3RJbexmP5ZA2wgKlZyMu8W5p4CO6fXIMP3HjIEHRmHmBzgMPEYenVvPusb5CQr/UA46P086/C+h3BITySoX63jVNwocchMWRyPcakY/qNjUZy6m+WlXpFhO6n5h247wqKyPgGz5vD6hl7n2AjUvujIOgd9qgd5848AtgTzZvU3AbavFBC/YfhCAJ1WvVi3G4ooRsf4U/XOsQnV5908KNiszLsQVmcNzdyFF5hMxwn7g4zeKuJJu/0VH/q4TXfb345bOh+HH3l6C+76LbhyQQ4KY8PnR/SeEL8mR+ETm14VYu8Sjo=212FD3x19z9sWBHDJACbC00B75E";
        await get_latest_order_information(1, 1, 1)
        //await get_latest_order_id(accountID, auth_token)

        //let auth_token = await get_access_token_from_cache(agentID, accountUsername);
        post_place_order_list.push({ accountID: accountID, auth_token: auth_token })
      }

      // Call the function to post to multiple APIs
      post_place_order_multiple_account(post_place_order_list, payload);

      // save trading positions to table copyTradingAccount
      result =
        await copyTradingAccountDBBOperation.createCopyTradingAccountItem(
          accountDocument,
          agentID,
          agentTradingSessionID,
          optionChainSymbol,
          optionChainAction,
          optionChainType,
          optionContractPrice,
          optionContractTotal
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

      const authToken = "LHhm2YNwWWGeL3cV5aHGWali6Lf9m7Uj8XUrxCqAoB2w1RPk4jSP/dmK9WRsO2DAvwj5+KJVRLlVtBRDQ+poai+7Qn9Lkk/6L2aYaxmakg1XCKcL4GKhJ2s5LD1vnMp7jNgRvxIuxHOta9NgsQid2JLzQWb/D+Dwls77R0uVuw6UHiWYa2gxdtMqnjzcoKkcIq4XLOpF9KCYxt2H8mkxUVYFqPQ3g1IPeVIRRfHaLKAYIuIHsA8mdFCjOO1/GargpAry7RTI4yldcg6VNI0LNmPeJyMdMwCyrjLaDEV69trcbvR9//bzrB/AH3CMfYjaD1X16hVlBsstnjQLa6dpedqhoUpvY2LzJxsiUWTJ5F7soLCaQdJ7rwBsNW9/71gjeJbQmWKaC2/bsHH195WKSK9Qrc8f1AaJWXK9r0+J+nFCQRxBEpp/eir6IdHjUkpfTjxm47lsM3LelsVhTvKGrU5DzYimDbR8Yd+eepkdHwlzcS+B/KvNrh5nHmw5EsGyta2ll4k/Z/Z60h28m+7fBuOJTMC100MQuG4LYrgoVi/JHHvlNt5vXhGfNcfkWJJ4SQewENyeP1VGOd0EDr03lPg03CRCDLpCp39nxRQggdTl9tHBOPzqDTHMJO6GeZhFJOWsWbyB51uHsWAA4wuupkkbe+o+HkzN5j70gf2GEp5ryIp+Vs66fEeM5Jw+ldITCZyUjkF+U/EbyWoIVOBDhoRVAWcEWBc47P4049k6oFYH1UHrxfsAWj4bBHhG/RgIOlmJQXr+pFGV+48kaldGj7+bCWW3RJbexmP5ZA2wgKlZyMu8W5p4CO6fXIMP3HjIEHRmHmBzgMPEYenVvPusb5CQr/UA46P086/C+h3BITySoX63jVNwocchMWRyPcakY/qNjUZy6m+WlXpFhO6n5h247wqKyPgGz5vD6hl7n2AjUvujIOgd9qgd5848AtgTzZvU3AbavFBC/YfhCAJ1WvVi3G4ooRsf4U/XOsQnV5908KNiszLsQVmcNzdyFF5hMxwn7g4zeKuJJu/0VH/q4TXfb345bOh+HH3l6C+76LbhyQQ4KY8PnR/SeEL8mR+ETm14VYu8Sjo=212FD3x19z9sWBHDJACbC00B75E";

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
        console.error(`No access token for agent ID ${agentID} and account username ${accountUsername}`);
        return { success: false, data: `No access token for agent ID ${agentID} and account username ${accountUsername}` };
      }
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
            currCopyTradingAccount.optionChainSymbol +
            "/" +
            currCopyTradingAccount.stockEntryPriceCurrency,
          optionChainAction: currCopyTradingAccount.optionChainAction,
          entryPrice: currCopyTradingAccount.optionContractPrice,
          orderQuantity: currCopyTradingAccount.orderQuantity,
          filledQuantity: currCopyTradingAccount.filledQuantity,
          orderDate: currCopyTradingAccount.orderDate.toLocaleString("en-US"),
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
              currCopyTradingAccount.optionChainSymbol +
              "/" +
              currCopyTradingAccount.stockEntryPriceCurrency,
            optionChainAction: currCopyTradingAccount.optionChainAction,
            entryPrice: currCopyTradingAccount.optionContractPrice,
            orderQuantity: currCopyTradingAccount.orderQuantity,
            filledQuantity: currCopyTradingAccount.filledQuantity,
            orderDate: currCopyTradingAccount.orderDate.toLocaleString("en-US"),
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
