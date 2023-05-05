const { accountDBOperation } = require("../data-access/index.js");
const { puppeteer_login_account } = require("./tradingAccountPuppeteer.js")

const jwt = require("jsonwebtoken");
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
      var result = await accountDBOperation.searchAccountName(
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
      return { success: false, data: error };
    }
  } else {
    return { success: true, data: null };
  }
}

// To get all accounts of particular agent
async function account_database(httpRequest) {
  const { token } = httpRequest.cookies;
  if (token) {
    const agentDocument = await jwt.verify(token, jwtSecret, {});
    try {
      agentID = agentDocument.id;

      const result = await accountDBOperation.searchAccountByAgentID(agentID);

      if (result.success) {
        const accountDocument = result.data;
        accountTableArray = [];
        Object.keys(accountDocument).forEach(function (key, index) {
          // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

          accountTableArray.push({
            accountName: accountDocument[index].accountName,
            accountUsername: accountDocument[index].accountUsername,
            accountBalance: 1000,
          });
        });
        return { success: true, data: accountTableArray };
      } else {
        return { success: false, data: result.error };
      }
    } catch (error) {
      return { success: false, data: error };
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
      return { success: false, data: error };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
  account_login,
  account_database,
  account_delete,
};
