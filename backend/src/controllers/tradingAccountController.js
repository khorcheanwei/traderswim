const { accountDBOperation } = require("../data-access/index.js");

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

// To login new account
async function account_login(httpRequest) {
  const { agentID, accountName, accountUsername, accountPassword } =
    httpRequest.body;

  try {
    // search for accountName
    var result = await accountDBOperation.searchAccountName(
      agentID,
      accountName
    );
    if (result.success == true) {
      const accountNameExist = result.data;
      if (accountNameExist) {
        return { success: true, data: "Account name exists for this agent" };
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
          data: "Trading account username exists for this agent",
        };
      }
    } else {
      return {
        success: false,
        data: result.error,
      };
    }

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
  } catch (error) {
    return { success: false, data: error };
  }
}

// To get all accounts of particular agent
async function account_database(httpRequest) {
  const { token } = httpRequest.cookies;
  if (token) {
    const agentDoc = await jwt.verify(token, jwtSecret, {});
    try {
      agentID = agentDoc.id;

      const result = await accountDBOperation.searchAccountByAgentID(agentID);

      if (result.success) {
        const accountDocument = result.data;
        accountTableArray = [];
        Object.keys(accountDocument).forEach(function (key, index) {
          // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

          accountTableArray.push({
            accountName: accountDocument[index].accountName,
            accountBalance: 1000, //hard code for now
            //accountConnection: accountDoc[index].accountConnection,
            accountConnection: accountDocument[index].accountConnection,
            accountStatus: accountDocument[index].accountConnection,
          });
        });
        return { success: true, data: accountTableArray };
      } else {
        return { success: false, data: result.error };
      }
    } catch (error) {
      return { success: false, data: result.error };
    }
  } else {
    return { success: false, data: null };
  }
}

// To change connection status
async function account_connection_status(httpRequest) {
  const { token } = httpRequest.cookies;
  const { accountName, accountConnection } = httpRequest.body;

  if (token) {
    try {
      const agentDoc = await jwt.verify(token, jwtSecret, {});

      agentID = agentDoc.id;
      const result = await accountDBOperation.updateAccountByAccountConnection(
        agentID,
        accountName,
        accountConnection
      );

      if (result.success) {
        return { success: true, data: "success" };
      } else {
        return { success: false, data: result.error };
      }
    } catch (error) {
      return { success: false, data: error };
    }
  } else {
    return { success: false, data: null };
  }
}

// To delete account
async function account_delete(httpRequest) {
  const { token } = httpRequest.cookies;
  const { accountName } = httpRequest.body;

  if (token) {
    try {
      const agentDoc = await jwt.verify(token, jwtSecret, {});

      const agentID = agentDoc.id;

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
  account_connection_status,
  account_delete,
};
