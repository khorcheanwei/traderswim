function copyTradingAccountDBOperation(trading_management_db) {
  this.trading_management_db = trading_management_db;

  // search searchCopyTradingAccount based on tradingSessionID
  this.searchCopyTradingAccountBasedTradingSessionID = async function (
    agentID,
    agentTradingSessionID
  ) {

    try {
      const sqlCommand = `SELECT * FROM copyTradingAccount WHERE agentID=? and agentTradingSessionID=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.all(sqlCommand, [agentID, agentTradingSessionID], (err, row) => {
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

  // search searchCopyTradingAccount
  this.searchCopyTradingAccount = async function (agentID) {
    try {
      const sqlCommand = `SELECT * FROM copyTradingAccount WHERE agentID=?`;

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

  // create new copyTradingAccount
  this.createCopyTradingAccountItem = async function (
    accountDocument,
    agentID,
    agentTradingSessionID,
    optionChainSymbol,
    optionChainAction,
    optionChainType,
    optionContractPrice,
    optionContractTotal
  ) {
    try {
      for (let index = 0; index < accountDocument.length; index++) {

        try {
          const sqlCommand = `INSERT INTO copyTradingAccount (agentID,agentTradingSessionID,accountID,accountName,accountUsername,optionChainSymbol,optionChainAction,optionChainType,optionContractPrice,stockEntryPriceCurrency,orderQuantity,filledQuantity,orderDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

          const timestamp = Date.now();
          const date = new Date(timestamp);
          const localTime = date.toLocaleString('en-US');

          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, agentTradingSessionID, accountDocument[index].id, accountDocument[index].accountName, accountDocument[index].accountUsername, optionChainSymbol, optionChainAction, optionChainType, optionContractPrice, "USD", optionContractTotal, 0, localTime], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
        } catch (error) {
          return { success: false, error: error };
        }
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error };
    }
  };
}
module.exports = copyTradingAccountDBOperation;
