const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function accountDBOperation(trading_management_db) {
  this.trading_management_db = trading_management_db;

  // search whether Account existed by agentID and accountName
  this.searchAccountName = async function (agentID, accountName) {
    try {
      let tableExists = false;
      const sqlCommand = `SELECT EXISTS(SELECT 1 FROM account WHERE agentID=? AND accountName=?) AS rowExists;`

      const row = await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentID, accountName], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      if (row.rowExists) {
        tableExists = true;
      }
      return { success: true, data: tableExists };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search whether Account existed by agentID and accountUsername
  this.searchAccountUsername = async function (agentID, accountUsername) {
    try {
      let tableExists = false;
      const sqlCommand = `SELECT EXISTS(SELECT 1 FROM account WHERE agentID=? AND accountUsername=?) AS rowExists;`

      const row = await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentID, accountUsername], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      if (row.rowExists) {
        tableExists = true;
      }
      return { success: true, data: tableExists };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search all Account by agentID
  this.searchAccountByAgentID = async function (agentID) {
    try{  
      const sqlCommand = `SELECT * FROM account WHERE agentID=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.all(sqlCommand, [agentID], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });

      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search a Account based on agentID and accountName
  this.deleteAccount = async function (agentID, accountName) {
    try{  
      const sqlCommand = `DELETE FROM account WHERE agentID=? AND accountName=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.all(sqlCommand, [agentID, accountName], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return { success: true };

    } catch (error) {
      return { success: false, error: error };
    };
  }

  // update accountConnection based on agentID, accountName, accountConnection
  this.updateAccountByAccountConnection = async function (
    agentID,
    accountName,
    accountConnection
  ) {

    try{  
      const sqlCommand = `UPDATE account SET accountConnection=? WHERE agentID=? AND accountName=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.all(sqlCommand, [accountConnection, agentID, accountName], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return { success: true };

    } catch (error) {
      return { success: false, error: error };
    };
  };

  // create Account based on agentID, accountName, accountUsername and accountPassword
  this.createAccountItem = async function (
    agentID,
    accountName,
    accountUsername,
    accountPassword
  ) {
    try {
      const sqlCommand = `INSERT INTO account (agentID, accountName, accountConnection, accountUsername, accountPassword)
                          VALUES (?, ?, ?, ?, ?);`

      agentPassword = bcrypt.hashSync(accountPassword, bcryptSalt)
      const accountConnection = true;

      await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentID, accountName, accountConnection, accountUsername, accountPassword], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return { success: true};
    } catch (error) {
      return { success: false, error: error };
    }
  };
}
module.exports = accountDBOperation;
