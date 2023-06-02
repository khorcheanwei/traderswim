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
  auth_token = 'gpaEBQIdPh9tuwIza0ioMqWOdds21zVlAie0p31Q5fv0g9uKR4gowoELjEbH5u0nXxMGxh1ouaVOgwypvTR9HHpZfPIeyThOssUjQdybyqEO9/7bbZld1KmA5C9msOt9EqsPLByZHilXaKUqlB2RigpEn3b7FQodtlVoCOkKJM2330rHkZIZfankIWbKiNz8Y89MHljF50p/t7AUeTz9WyzL5KGJ7rIYy/hfQWhWbZtACxCrHjpIAvDSAE6QWtWJbzlO8vQ50CP/4ezJBTo42WmrZtBzKHyaTl/f54aPolqu/Pf/VTODhvgipSUKTjivIu2tBoGi6iCJ+Tc/Mhu2LvaSYEc0xhW3Cy1f0teuModG7zdfbM2kCGWDDWflGpNuKIFv1rSZ0VtoJnsmbNEIzi1qINEYCeAudZTRkkcqR09O5zgLpI0C+5jSrvTR4x03pwkds16V4fKRNR1up8B9C/PtesyeWVAxI9kvur7BwN+ovMcrezxnNB+xVf3y/xyeLKyInWRbNVDkcp/zWhuTHjbZ+xn100MQuG4LYrgoVi/JHHvlsHtsCaZ3Qn/KkqytbwM3hjfW5SuMgMEjTTBPKZs7H4r4V8MUklKn27bZVFP1Obt7kCc4BnWWxxFfSBaAyHqi+Nz3WJIn/2AQrViU/VI4N4nqS6TonUOrqXoWm7ZUeKA7qe5cbRY/rgig0gXAECuDw6doXHzENlWEA3RVxFb+0iKmmlVyxABch70AMTKuI1dQOKxo1QesL4wpQMdHI2rHNE3bUdy4GubyKthSpgVIF000AVoiqXDKMubumN6N4zH7M3TLuhrgM4Y327Fh2budyrJynnKiuWQ387H5+1Bwh19EnYpbXTtLKUSEL40UEvk+yfQx5lBCI/cOiQyqfke5xBrjKXHSn14jKS8euuh5mGWgRmcgewwHOf77QhOzOAzqlWuq/FZEUgTCLyC0WWrmuQX9Hj/AcEuI2UCt2WsizYSNQXVn4/36cEHcGYhxI6fAJcv7BIohs8OS+SGa5eW2EjKI5Rp91WByieoEDYvBzU6hNn9TU+l+QJHPx36XlWrnW/2g1i49t5L4JDhZpYOkZG0Rm9I=212FD3x19z9sWBHDJACbC00B75E';
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.tdameritrade.com/v1/accounts/${accountID}`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth_token}`
    }
  }

  try {
    const response = await axios.request(config)
    console.log(response);
  } catch (error) {
    console.error(`Error get latest order ID for accountID ${accountID}, ${error}`);
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

        get_latest_order_id(accountID, auth_token)

        let auth_token = "3Nk2ReMq2rb8DMfpOGx4gHr/m4n9ZcPwN0Dg4UhmzsUWTK1QkkoXqYQD8JAkLwyZExJ498su3mQ53lTzegbpkc57vdDRorsqg35tWVCzR2SR3UPhPt1408paGvQTjaT/k0OeZzbpZC9N4++H2iaaTNMj6TaeYmuxMcRf7JwFstmdjUTRcYIPrIoW2w8HTBUvlwRjk2A5ZLGFMlM74kO5hmVbKOdgdpnhEf21VKnGRHe7L/HxDh0WadU8xgpspGvidMwEQKFlpzJq5Pg3yF+LiV8iEeJZqRuHGJVoMFlyLSkmeApEiXP0KKn4/Jik2iIcHzYSh4JJIVKfU5ODQHWSXsA2h8/O3v2dSJxpgj2KfITVAUr126Dauu6Btuxo6bxO+D9wdIEajU0NTNTHM6x0EjLUOAitYWmt6ZIh0iYlvKHr3tb09N6Myf9IxTSlY0H6kMjuwQpBCDpwF9mnmQtluyYKF627U01gFKMnVw64GCzNtTghUi4xOkKWsCIu26zphgDFZiz8wL0ioWuHtyRNv4RGaKBH0BhN0NuOF100MQuG4LYrgoVi/JHHvlhiPLUQwetFBLZCShBp4hucpIhe4mdimQcDmFD3bIHpkI735AM8jODSx4gJf+/v1MsuRzzvtFAS6kHPg0U+F0Msp8t3ndO9kmKc752pSmKcG1Zo3lcTrWZcJMMWnKLFVvPISQqLpOERby/rKH5cFtvFR2hjCFCdwH6dGX37Q9Wihd/we9kqrUL1wz1iqC07BWSdnGuoBQ2EbNcDkvMR95nLYplNUoUAXTZrEB2aCQnKe2CCyVHh9Wd2BcJkwt2pKoRgFKF5T32qNjrM/UCoj+6S3YupTW7V0b2jVznreEiHSZC8ju81suNQPFQXFAM2Bhk6bvn9/YcZXorOxixAiOjjWOLQOMNa60CT/fMYs1ljuvlhM/K3F5dJfQCZgLDfIJ+RJeZLjWniMZam5iab1vnSMjHTmlem43PjkuxsnmMCGhsUBKH7ZYNwOfwmCBZpqLCDP+aldjD8tXfs+DIavO84mHwjo+dzZgOToPFDSnLKR97QkLmULEk7KpG2oPXsEv+VBjv3oyOILbhuqp+hgiZJXpcE7Y25TiXbBvxr212FD3x19z9sWBHDJACbC00B75E";
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

      const authToken = "3Nk2ReMq2rb8DMfpOGx4gHr/m4n9ZcPwN0Dg4UhmzsUWTK1QkkoXqYQD8JAkLwyZExJ498su3mQ53lTzegbpkc57vdDRorsqg35tWVCzR2SR3UPhPt1408paGvQTjaT/k0OeZzbpZC9N4++H2iaaTNMj6TaeYmuxMcRf7JwFstmdjUTRcYIPrIoW2w8HTBUvlwRjk2A5ZLGFMlM74kO5hmVbKOdgdpnhEf21VKnGRHe7L/HxDh0WadU8xgpspGvidMwEQKFlpzJq5Pg3yF+LiV8iEeJZqRuHGJVoMFlyLSkmeApEiXP0KKn4/Jik2iIcHzYSh4JJIVKfU5ODQHWSXsA2h8/O3v2dSJxpgj2KfITVAUr126Dauu6Btuxo6bxO+D9wdIEajU0NTNTHM6x0EjLUOAitYWmt6ZIh0iYlvKHr3tb09N6Myf9IxTSlY0H6kMjuwQpBCDpwF9mnmQtluyYKF627U01gFKMnVw64GCzNtTghUi4xOkKWsCIu26zphgDFZiz8wL0ioWuHtyRNv4RGaKBH0BhN0NuOF100MQuG4LYrgoVi/JHHvlhiPLUQwetFBLZCShBp4hucpIhe4mdimQcDmFD3bIHpkI735AM8jODSx4gJf+/v1MsuRzzvtFAS6kHPg0U+F0Msp8t3ndO9kmKc752pSmKcG1Zo3lcTrWZcJMMWnKLFVvPISQqLpOERby/rKH5cFtvFR2hjCFCdwH6dGX37Q9Wihd/we9kqrUL1wz1iqC07BWSdnGuoBQ2EbNcDkvMR95nLYplNUoUAXTZrEB2aCQnKe2CCyVHh9Wd2BcJkwt2pKoRgFKF5T32qNjrM/UCoj+6S3YupTW7V0b2jVznreEiHSZC8ju81suNQPFQXFAM2Bhk6bvn9/YcZXorOxixAiOjjWOLQOMNa60CT/fMYs1ljuvlhM/K3F5dJfQCZgLDfIJ+RJeZLjWniMZam5iab1vnSMjHTmlem43PjkuxsnmMCGhsUBKH7ZYNwOfwmCBZpqLCDP+aldjD8tXfs+DIavO84mHwjo+dzZgOToPFDSnLKR97QkLmULEk7KpG2oPXsEv+VBjv3oyOILbhuqp+hgiZJXpcE7Y25TiXbBvxr212FD3x19z9sWBHDJACbC00B75E";

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
