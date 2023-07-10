function tradeHistoryDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // create new tradeHistory
    this.createtradeHistoryItem = async function (
      agentTradingSessionID,
      order_information,
    ) {
        try {
          const agentID = order_information['agentID'];
          const accountId = order_information['accountId'];
          const accountName = order_information['accountName'];
          const accountUsername = order_information['accountUsername'];
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
          const sqlCommand = `INSERT INTO tradeHistory (agentID, agentTradingSessionID, accountId, accountName, accountUsername, optionChainSymbol, optionChainDescription, optionChainOrderId, optionChainOrderType, optionChainInstruction, optionChainPrice, optionChainQuantity, optionChainFilledQuantity, optionChainStatus, optionChainEnteredTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`
  
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, agentTradingSessionID, accountId, accountName, accountUsername, optionChainSymbol, optionChainDescription, optionChainOrderId, optionChainOrderType, optionChainInstruction, optionChainPrice, optionChainQuantity, optionChainFilledQuantity, optionChainStatus, optionChainEnteredTime], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful save orders for all trading accounts to tradeHistory table - accountUsername: ${accountUsername}`)
          return true;
        } catch (error) {
          console.log(`Failed save orders for all trading accounts to tradeHistory table. Error: ${error.message}`);
          return false;
        }
    }


    // search tradeHistory based on agentID
    this.searchTradeHistoryBasedAgentID = async function (
        agentID
    ) {
        try {
            const sqlCommand = `SELECT * FROM tradeHistory WHERE agentID=?`;

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
  
  module.exports = tradeHistoryDBOperation;