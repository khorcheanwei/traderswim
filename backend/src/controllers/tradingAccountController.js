const { accountDBOperation } = require("../data-access/index.js");
const { puppeteer_login_account, get_access_token_from_cache, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")
const common = require("../common.js");

const puppeteer = require('puppeteer');
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { Cluster } = require('puppeteer-cluster');
const jwtSecret = "traderswim";

// To login new account
async function account_login(httpRequest) {
  const { accountName, accountUsername, accountPassword } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = await jwt.verify(token, jwtSecret, {});
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
      const connected = await puppeteer_login_account(accountUsername, accountPassword);

      if (connected) {
        result = await accountDBOperation.createAccountItem(
          agentID,
          accountID,
          accountName,
          accountUsername,
          accountPassword
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

// To get all accounts of particular agent
async function account_database(httpRequest) {
  const { token } = httpRequest.cookies;
  if (token) {
    const agentDocument = jwt.verify(token, jwtSecret, {});
    try {
      agentID = agentDocument.id;

      const result = await accountDBOperation.searchAccountByAgentID(agentID);

      /*
      console.log("fdfgfdg")
      io.on('connection', (socket) => {
        socket.on('longProcess', async () => {
          try {
            // Simulating a long-running process
            const result = await performLongProcess();
      
            // Emit the result to the client
            socket.emit('processResult', result);
          } catch (error) {
            // Handle any errors during the process
            socket.emit('processError', error.message);
          }
        });
      });
      */


      if (result.success) {
        const accountDocument = result.data;

        let accountTableArray = [];
        Object.keys(accountDocument).forEach(async function (key, index) {
          // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

          let accountConnection =  await puppeteer_login_account(agentID, accountDocument[index].accountUsername, accountDocument[index].accountPassword)
          
          accountTableArray.push({
            accountName: accountDocument[index].accountName,
            accountUsername: accountDocument[index].accountUsername,
            accountBalance: 1000,
            accountConnection: accountConnection,
          });
        });

        return { success: true, data: accountTableArray };
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


// To delete account
async function account_delete(httpRequest) {
  const { token } = httpRequest.cookies;
  const { accountName } = httpRequest.body;

  if (token) {
    try {
      const agentDocument = await jwt.verify(token, jwtSecret, {});

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
  fetch_trading_account_info,
  account_database,
  account_delete,
};
