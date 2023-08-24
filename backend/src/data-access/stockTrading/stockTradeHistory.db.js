function stockTradeHistoryDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // create new stockTradeHistory
    this.createStockTradeHistoryItem = async function (
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

          const sqlCommand = `INSERT INTO stockTradeHistory (agentID, agentTradingSessionID, accountId, accountName, accountUsername, stockSymbol, stockSession, stockDuration, stockOrderId, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity, stockFilledQuantity, stockStatus, stockEnteredTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, agentTradingSessionID, accountId, accountName, accountUsername, stockSymbol, stockSession, stockDuration, stockOrderId, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity, stockFilledQuantity, stockStatus, stockEnteredTime], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful save orders for all trading accounts to stockTradeHistory table - accountUsername: ${accountUsername}`)
          return true;
        } catch (error) {
          console.log(`Failed save orders for all trading accounts to stockTradeHistory table. Error: ${error.message}`);
          return false;
        }
    }


    // search stockTradeHistory based on agentID
    this.searchStockTradeHistoryBasedAgentID = async function (
        agentID
    ) {
        try {
            const sqlCommand = `SELECT * FROM stockTradeHistory WHERE agentID=?`;

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
    };
  
  module.exports = stockTradeHistoryDBOperation;