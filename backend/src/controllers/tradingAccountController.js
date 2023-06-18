const { accountDBOperation } = require("../data-access/index.js");
const { get_auth_connection_time, puppeteer_login_account, get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")
const common = require("../common.js");

const puppeteer = require('puppeteer');
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { Cluster } = require('puppeteer-cluster');
const jwtSecret = "traderswim";

var Memcached = require('memcached-promise');
var account_cache = new Memcached('127.0.0.1:11211');

// To fetch trading account info
async function fetch_trading_account_id(agentID, accountUsername) {
  try {

    const authToken = await get_access_token_from_cache(agentID, accountUsername);
    let config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }

    const response = await axios.get('https://api.tdameritrade.com/v1/accounts', headers = config);
    const accountId = response.data[0]["securitiesAccount"]["accountId"];

    return accountId;

  } catch (error) {
    console.log(`${agentID} and ${accountUsername} . Error is ${error}`)
  }
}

// To login new account
async function account_login(httpRequest) {
  const { accountName, accountUsername, accountPassword } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      // search for accountName
      let result = await accountDBOperation.searchAccountName(
        agentID,
        accountName
      );
      if (result.success == true) {
        const accountNameExist = result.data;
        if (accountNameExist) {
          return { success: true, data: "Name exists" };
        }
      } else {
        return { success: false, data: result.error };
      }

      // search for accountUsername
      result = await accountDBOperation.searchAccountUsername(
        agentID,
        accountUsername
      );
      if (result.success == true) {
        const accountUsernameExist = result.data;
        if (accountUsernameExist) {
          return {
            success: true,
            data: "Account username exists.",
          };
        }
      } else {
        return {
          success: false,
          data: result.error,
        };
      }

      // login thinkorswim website
      let { connected, refreshToken } = await puppeteer_login_account(agentID, accountUsername, accountPassword);

      if (connected) {

        const accountId = await fetch_trading_account_id(agentID, accountUsername);
        result = await accountDBOperation.createAccountItem(
          agentID,
          accountId,
          accountName,
          accountUsername,
          accountPassword,
          refreshToken
        );

        if (result.success) {
          return {
            success: true,
            data: { accountName },
          };
        } else {
          return { success: false, data: result.error };
        }

      } else {
        return { success: true, data: "Failed to login" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

// To fetch trading account info
async function fetch_trading_account_info(httpRequest, httpResponse) {

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      const { accountUsername } = httpRequest.body;

      const authToken = await get_access_token_from_cache(agentID, accountUsername);
      let config = {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }

      await axios.get('https://api.tdameritrade.com/v1/accounts', headers = config)
        .then(response => {
          httpResponse.status(200).json(response.data[0]);
        })
        .catch(error => {
          // Handle any errors
          console.log(error.message)
          httpResponse.status(400).json(error.message);
        });


    } catch (error) {
      httpResponse.status(400).json(error.message);
    }
  } else {
    httpResponse.status(200).json(null);
  }
}

// update trading active for account
async function account_update_trading_active(httpRequest, httpResponse) {
  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      const { accountUsername, accountTradingActive } = httpRequest.body;

      result = await accountDBOperation.updateTradingActive(
        agentID,
        accountUsername,
        accountTradingActive
      );

      if (result.success) {
        return {
          success: true,
          data: { accountUsername },
        };
      } else {
        return { success: false, data: result.error };
      }


    } catch (error) {
      httpResponse.status(400).json(error.message);
    }
  } else {
    httpResponse.status(200).json(null);
  }
}

// Get account value
async function get_account_value(agentID, accountUsername) {

  try {
    const authToken = await get_access_token_from_cache(agentID, accountUsername);
    let config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    }
    const response = await axios.get('https://api.tdameritrade.com/v1/accounts', headers = config);
    const result = response.data[0];
    if (response.status == 200) {
      console.error(`Successful get account value - accountUsername: ${accountUsername}. Status: ${response.status}`);
      const accountValue = result["securitiesAccount"]["currentBalances"]["cashBalance"];
      return accountValue;
    } else {
      console.error(`Failed get account value - accountUsername: ${accountUsername}. Status: ${response.status}`);
      return null;
    }
    

  } catch (error) {
    console.error(`Failed get account value - accountUsername: ${accountUsername}. Error: ${error.message}`);
    return null;
  }
}

// Get account connection time
async function get_account_connection_time(agentID, accountUsername) {

  try {
    const authTokenTimeDifference = await get_auth_connection_time(agentID, accountUsername);
    return authTokenTimeDifference;
  } catch (error) {
    console.error(`Failed get account value - accountUsername: ${accountUsername}. Error: ${error.message}`);
    return null;
  }
}


// Puppeteer login for all accounts
async function puppeteer_login_all_accounts(agentID, accountDocument) {
  try {
    const get_latest_order_id_requests =  accountDocument.map(async (accountDocumentPart, index) => {
      // need to go Ameritrade website to check whether it is successful to convert to connect to website or not
      let { connected, refreshToken } = await puppeteer_login_account(agentID, accountDocumentPart.accountUsername, accountDocumentPart.accountPassword);
      let accountValue  = await get_account_value(agentID, accountDocumentPart.accountUsername);
      let authTokenTimeInSeconds = await get_account_connection_time(agentID, accountDocumentPart.accountUsername);
      let authTokenTimeInMinutes = (20 - (authTokenTimeInSeconds/60)).toFixed(2);
      if (accountValue == null) {
        accountValue = "loading...";
        authTokenTimeInMinutes = "loading..."
      }

      return {
        accountName: accountDocumentPart.accountName,
        accountUsername: accountDocumentPart.accountUsername,
        accountBalance: accountValue,
        accountConnection: connected,
        accountTradingActive: accountDocumentPart.accountTradingActive,
        accountConnectionTime: authTokenTimeInMinutes,
      };
    });

    const result_promise = await Promise.all(get_latest_order_id_requests);
    console.log('Puppeteer login for all accounts promise requests completed');
    return result_promise;
  } catch (error) {
    console.log(`Error in Puppeteer login for all accounts requests completed. Error: ${error.message}`);
    return null;
  }
}

// To get account database by agent
async function account_database_by_agent(agentID) {
  try {
    const result = await accountDBOperation.searchAccountByAgentID(agentID);

    if (result.success) {
      const accountDocument = result.data;

      let accountTableArray = await puppeteer_login_all_accounts(agentID, accountDocument);

      // save accountTableArray to cache
      let accountTableArray_key = agentID + "." + "accountTableArray";
  
      await account_cache.set(accountTableArray_key, accountTableArray)
      

      return accountTableArray;
    }
  } catch(error) {
    return null;
  }
} 


// To get all accounts of particular agent
async function account_database(httpRequest) {
  const { token } = httpRequest.cookies;
  if (token) {
    const agentDocument = jwt.verify(token, jwtSecret, {});
    try {
      const agentID = agentDocument.id;

      // get accountTableArray from cache
      let accountTableArray_key = agentID + "." + "accountTableArray";
      let accountTableArray = await account_cache.get(accountTableArray_key);

      if(accountTableArray != undefined) {
        return { success: true, data: accountTableArray };
      }     

      accountTableArray = await account_database_by_agent(agentID);
      return {success: true, data: accountTableArray}
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}


// To delete account
async function account_delete(httpRequest) {
  const { token } = httpRequest.cookies;
  const { accountName } = httpRequest.body;

  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});

      const agentID = agentDocument.id;

      const result = await accountDBOperation.deleteAccount(
        agentID,
        accountName
      );

      if (result) {
        return { success: true, data: "success" };
      } else {
        return { success: false, data: result.error };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
  account_login,
  account_update_trading_active,
  fetch_trading_account_info,
  account_database,
  account_delete,
  account_database_by_agent,
};
