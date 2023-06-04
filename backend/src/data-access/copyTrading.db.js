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
    agentTradingSessionID,
    accountDocumentPart,
    order_information,
  ) {
      try {
        const agentID = accountDocumentPart['agentID'];
        const accountId = accountDocumentPart['accountId'];
        const accountName = accountDocumentPart['accountName'];
        const accountUsername = accountDocumentPart['accountUsername'];
        const optionChainSymbol = order_information['optionChainSymbol'];
        const optionChainDescription = order_information['optionChainDescription'];
        const optionChainOrderId = order_information['optionChainOrderId'];
        const optionChainOrderType = order_information['optionChainOrderType'];
        const optionChainInstruction = order_information['optionChainInstruction'];
        const optionChainPrice = order_information['optionChainPrice'];
        const optionChainQuantity = order_information['optionChainQuantity'];
        const optionChainFilledQuantity = order_information['optionChainFilledQuantity'];
        const optionChainStatus = order_information['optionChainStatus'];
        const optionChainEnteredTime = order_information['optionChainEnteredTime'];
        const sqlCommand = `INSERT INTO copyTradingAccount (agentID, agentTradingSessionID, accountId, accountName, accountUsername, optionChainSymbol, optionChainDescription, optionChainOrderId, optionChainOrderType, optionChainInstruction, optionChainPrice, optionChainQuantity, optionChainFilledQuantity, optionChainStatus, optionChainEnteredTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

        await new Promise((resolve, reject) => {
          this.trading_management_db.get(sqlCommand, [agentID, agentTradingSessionID, accountId, accountName, accountUsername, optionChainSymbol, optionChainDescription, optionChainOrderId, optionChainOrderType, optionChainInstruction, optionChainPrice, optionChainQuantity, optionChainFilledQuantity, optionChainStatus, optionChainEnteredTime], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        });
        console.log(`Successful save orders for all trading accounts to copyTradingAccount table - accountUsername: ${accountUsername}`)
        return true;
      } catch (error) {
        console.log(`Failed save orders for all trading accounts to copyTradingAccount table. Error: ${error.message}`);
        return false;
      }
  }
};

module.exports = copyTradingAccountDBOperation;
