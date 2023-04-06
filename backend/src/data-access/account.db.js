const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function accountDBOperation(Account) {
  this.Account = Account;

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
