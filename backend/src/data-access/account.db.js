const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function accountDBOperation(Account) {
  this.Account = Account;

  // search whether Account existed by agentID and accountName
  this.searchAccountName = async function (agentID, accountName) {
    try {
      const queryResult = await this.Account.exists({
        agentID: agentID,
        accountName: accountName,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search whether Account existed by agentID and accountUsername
  this.searchAccountUsername = async function (agentID, accountUsername) {
    try {
      const queryResult = await this.Account.exists({
        agentID: agentID,
        accountUsername: accountUsername,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search all Account by agentID
  this.searchAccountByAgentID = async function (agentID) {
    try {
      const queryResult = await this.Account.find({
        agentID: agentID,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search all AccountName by agentID
  this.searchAccountNameByAgentID = async function (agentID) {
    try {
      const queryResult = await Account.find(
        { agentID: agentID },
        {
          _id: 1,
          accountName: 1,
        }
      );
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search a Account based on agentID and accountName
  this.deleteAccount = async function (agentID, accountName) {
    try {
      await Account.deleteOne({ agentID: agentID, accountName: accountName });
      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // update accountConnection based on agentID, accountName, accountConnection
  this.updateAccountByAccountConnection = async function (
    agentID,
    accountName,
    accountConnection
  ) {
    try {
      var query = { agentID: agentID, accountName: accountName };
      var updatedQuery = { accountConnection: accountConnection };

      await Account.updateOne(query, updatedQuery);

      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // create Account based on agentID, accountName, accountUsername and accountPassword
  this.createAccountItem = async function (
    agentID,
    accountName,
    accountUsername,
    accountPassword
  ) {
    try {
      const accountConnection = true;
      await this.Account.create({
        agentID: agentID,
        accountName: accountName,
        accountConnection: accountConnection,
        accountUsername: accountUsername,
        accountPassword: bcrypt.hashSync(accountPassword, bcryptSalt),
      });
      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };
}
module.exports = accountDBOperation;
