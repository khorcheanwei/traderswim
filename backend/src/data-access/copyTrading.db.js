function copyTradingAccountDBOperation(trading_management_db) {
  this.trading_management_db = trading_management_db;

  // search searchCopyTradingAccount based on agentID
  this.searchCopyTradingAccountBasedAgentID = async function (
    agentID
  ) {

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

  // search searchCopyTradingAccount based on agentID and agentTradingSessionID
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

  // search searchCopyTradingAccount based on agentID, agentTradingSessionID, accountId
  this.searchCopyTradingAccountBasedTradingSessionIDAndAccountId = async function (
    agentID,
    agentTradingSessionID,
    accountId,
  ) {

    try {
      const sqlCommand = `SELECT * FROM copyTradingAccount WHERE agentID=? and agentTradingSessionID=? and accountId=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.all(sqlCommand, [agentID, agentTradingSessionID, accountId], (err, row) => {
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

  // get all orderID for all trading accounts
  this.getAllOrderID = async function (agentID, agentTradingSessionID) {
    try {

      const sqlCommand = `SELECT id, agentID, accountId, accountUsername, optionChainOrderId FROM copyTradingAccount WHERE agentID=? AND agentTradingSessionID=?`;

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
  }

  // get all optionChainSymbol for all trading accounts
  this.getAllOptionChainSymbol = async function (agentID, agentTradingSessionID) {
    try {

        const sqlCommand = `SELECT optionChainSymbol FROM copyTradingAccount WHERE agentID=? AND agentTradingSessionID=?`;

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
  }

  // get all optionChainStatus for all trading accounts
  this.getAllOptionChainStatus = async function (agentID, agentTradingSessionID) {
    try {

        const sqlCommand = `SELECT optionChainStatus FROM copyTradingAccount WHERE agentID=? AND agentTradingSessionID=?`;

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
  }

  // get all optionChainSymbol for all trading accounts
  this.getAllOptionChainSymbolList = async function () {
    try {

        const sqlCommand = `SELECT DISTINCT optionChainSymbol FROM copyTradingAccount`;

        const queryResult = await new Promise((resolve, reject) => {
          this.trading_management_db.all(sqlCommand, [], (err, row) => {
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
  }


  // update order information for all trading accounts
  this.updateAllOrderInformation = async function (copy_trading_table_id_list, result_promise_order_information) {
    try {

      const sqlCommand = `UPDATE copyTradingAccount SET optionChainSymbol=?, optionChainDescription=?, optionChainOrderType=?, optionChainInstruction=?, optionChainPrice=?, optionChainQuantity=?, optionChainFilledQuantity=?, optionChainStatus=?, optionChainEnteredTime=? WHERE id=?`;
      
      const queryResult = await new Promise((resolve, reject) => {
        for (let index = 0; index < copy_trading_table_id_list.length; index++) {
          const copy_trading_table_id = copy_trading_table_id_list[index];
          const copy_trading_table_row = result_promise_order_information[index];

          const optionChainSymbol = copy_trading_table_row["optionChainSymbol"];
          if (optionChainSymbol == null) {
            continue;
          }
          const optionChainDescription = copy_trading_table_row["optionChainDescription"];
          const optionChainOrderType = copy_trading_table_row["optionChainOrderType"];
          const optionChainInstruction = copy_trading_table_row["optionChainInstruction"];
          const optionChainPrice = copy_trading_table_row["optionChainPrice"];
          const optionChainQuantity = copy_trading_table_row["optionChainQuantity"];
          const optionChainFilledQuantity = copy_trading_table_row["optionChainFilledQuantity"];
          const optionChainStatus = copy_trading_table_row["optionChainStatus"];
          const optionChainEnteredTime = copy_trading_table_row["optionChainEnteredTime"];

          this.trading_management_db.all(sqlCommand, [optionChainSymbol, optionChainDescription, optionChainOrderType, optionChainInstruction, optionChainPrice, optionChainQuantity, optionChainFilledQuantity, optionChainStatus, optionChainEnteredTime, copy_trading_table_id], (err, row) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });

      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
    
  }
};

module.exports = copyTradingAccountDBOperation;
