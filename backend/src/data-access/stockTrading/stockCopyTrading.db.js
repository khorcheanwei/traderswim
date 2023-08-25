function stockCopyTradingDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // get all stockCopyTrading
    this.getAllStockCopyTrading = async function (
    ) {
  
      try {
        const sqlCommand = `SELECT * FROM stockCopyTrading`;
  
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
    };
  
    // delete all stockCopyTrading
    this.deleteAllStockCopyTrading = async function (
      ) {
    
        try {
          const sqlCommand = `DELETE FROM stockCopyTrading`;
    
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
      };
  
    // search searchStockCopyTrading based on agentID
    this.searchStockCopyTradingBasedAgentID = async function (
      agentID
    ) {
  
      try {
        const sqlCommand = `SELECT * FROM stockCopyTrading WHERE agentID=?`;
  
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
  
    // search searchStockCopyTrading based on agentID and agentTradingSessionID
    this.searchStockCopyTradingBasedTradingSessionID = async function (
      agentID,
      agentTradingSessionID
    ) {
  
      try {
        const sqlCommand = `SELECT * FROM stockCopyTrading WHERE agentID=? and agentTradingSessionID=?`;
  
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
  
    // search searchStockCopyTrading based on agentID, agentTradingSessionID, accountId
    this.searchStockCopyTradingBasedTradingSessionIDAndAccountId = async function (
      agentID,
      agentTradingSessionID,
      accountId,
    ) {
  
      try {
        const sqlCommand = `SELECT * FROM stockCopyTrading WHERE agentID=? and agentTradingSessionID=? and accountId=?`;
  
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
  
    // search searchStockCopyTrading
    this.searchStockCopyTrading = async function (agentID) {
      try {
        const sqlCommand = `SELECT * FROM stockCopyTrading WHERE agentID=?`;
  
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

    // create new stockCopyTrading
    this.createStockCopyTradingItem = async function (
      agentTradingSessionID,
      order_information,
    ) {
        try {
          const agentID = order_information['agentID'];
          const accountId = order_information['accountId'];
          const accountName = order_information['accountName'];
          const accountUsername = order_information['accountUsername'];
          const stockSymbol = order_information['stockSymbol'];
          const stockSession = order_information['stockSession'];
          const stockDuration = order_information['stockDuration'];
          const stockOrderId = order_information['stockOrderId'];
          const stockOrderType = order_information['stockOrderType'];
          const stockInstruction = order_information['stockInstruction'];
          const stockPrice = order_information['stockPrice'];
          const stockStopPrice = order_information['stockStopPrice'];
          const stockStopPriceLinkType = order_information['stockStopPriceLinkType'];
          const stockStopPriceOffset = order_information['stockStopPriceOffset'];
          const stockQuantity = order_information['stockQuantity'];
          const stockFilledQuantity = order_information['stockFilledQuantity'];
          const stockStatus = order_information['stockStatus'];
          const stockEnteredTime = order_information['stockEnteredTime'];
          const sqlCommand = `INSERT INTO stockCopyTrading (agentID, agentTradingSessionID, accountId, accountName, accountUsername, stockSymbol, stockSession, stockDuration, stockOrderId, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity, stockFilledQuantity, stockStatus, stockEnteredTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, agentTradingSessionID, accountId, accountName, accountUsername, stockSymbol, stockSession, stockDuration, stockOrderId, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity, stockFilledQuantity, stockStatus, stockEnteredTime], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful save orders for all trading accounts to stockCopyTrading table - accountUsername: ${accountUsername}`)
          return true;
        } catch (error) {
          console.log(`Failed save orders for all trading accounts to stockCopyTrading table. Error: ${error.message}`);
          return false;
        }
    }
  
    // get all orderID for all trading accounts
    this.getAllOrderID = async function (agentID, agentTradingSessionID) {
      try {
  
        const sqlCommand = `SELECT id, agentID, accountId, accountUsername, stockOrderId FROM stockCopyTrading WHERE agentID=? AND agentTradingSessionID=?`;
  
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
  
    // get all stockSymbol for all trading accounts
    this.getAllStockSymbol = async function (agentID, agentTradingSessionID) {
      try {
  
          const sqlCommand = `SELECT stockSymbol FROM stockCopyTrading WHERE agentID=? AND agentTradingSessionID=?`;
  
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
  
    // get all stockStatus for all trading accounts
    this.getAllStockStatus = async function (agentID, agentTradingSessionID) {
      try {
  
          const sqlCommand = `SELECT stockStatus FROM stockCopyTrading WHERE agentID=? AND agentTradingSessionID=?`;
  
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
    // get all agentTradingSessionID for all trading accounts where stockStatus is not equal to REJECTED, CANCELED, FILLED, EXPIRED
    this.getAllAgentTradingSessionIDBasedStockStatus = async function (agentID) {
      try {
  
          const sqlCommand = `SELECT DISTINCT agentTradingSessionID FROM stockCopyTrading WHERE agentID=? AND stockStatus!='REJECTED' AND stockStatus!='CANCELED' AND stockStatus!='FILLED' AND stockStatus!='EXPIRED';`;
  
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
    }
  
    // get all stockSymbol for all trading accounts
    this.getAllStockSymbolList = async function () {
      try {
  
          const sqlCommand = `SELECT DISTINCT stockSymbol FROM stockCopyTrading`;
  
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
  
        const sqlCommand = `UPDATE stockCopyTrading SET stockSymbol=?, stockOrderType=?, stockInstruction=?, stockPrice=?, stockQuantity=?, stockFilledQuantity=?, stockStatus=?, stockEnteredTime=? WHERE id=?`;
        
        const queryResult = await new Promise((resolve, reject) => {
          for (let index = 0; index < copy_trading_table_id_list.length; index++) {
            const copy_trading_table_id = copy_trading_table_id_list[index];
            const copy_trading_table_row = result_promise_order_information[index];
  
            const stockSymbol = copy_trading_table_row["stockSymbol"];
            if (stockSymbol == null) {
              continue;
            }
            const stockOrderType = copy_trading_table_row["stockOrderType"];
            const stockInstruction = copy_trading_table_row["stockInstruction"];
            const stockPrice = copy_trading_table_row["stockPrice"];
            const stockQuantity = copy_trading_table_row["stockQuantity"];
            const stockFilledQuantity = copy_trading_table_row["stockFilledQuantity"];
            const stockStatus = copy_trading_table_row["stockStatus"];
            const stockEnteredTime = copy_trading_table_row["stockEnteredTime"];
  
            this.trading_management_db.all(sqlCommand, [stockSymbol, stockOrderType, stockInstruction, stockPrice, stockQuantity, stockFilledQuantity, stockStatus, stockEnteredTime, copy_trading_table_id], (err, row) => {
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
  
  module.exports = stockCopyTradingDBOperation;