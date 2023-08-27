function stockSaveOrderDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // get stock save order list
    this.getStockSaveOrderList = async function (
        agentID,
    ) {
        try {
          const sqlCommand = `SELECT * FROM stockSaveOrder WHERE agentID=?`
  
          const queryResult = await new Promise((resolve, reject) => {
            this.trading_management_db.all(sqlCommand, [agentID], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful get stock save order list for agent ID ${agentID}`)
          return queryResult;
        } catch (error) {
          console.log(`Failed get stock save order list for agent ID ${agentID}`);
          return [];
        }
    }

    // add stock save order
    this.addStockSaveOrder = async function (
      agentID, 
      stockSymbol, 
      stockSession, 
      stockDuration, 
      stockOrderType, 
      stockInstruction, 
      stockPrice, 
      stockStopPrice, 
      stockStopPriceLinkType, 
      stockStopPriceOffset, 
      stockQuantity

    ) {
        try {
          const sqlCommand = `INSERT OR REPLACE INTO stockSaveOrder (agentID, stockSymbol, stockSession, stockDuration, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, stockSymbol, stockSession, stockDuration, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful add stock save order for agent ID ${agentID}`)

          const queryResult = this.getStockSaveOrderList(agentID);
          return queryResult;
        } catch (error) {
          console.log(`Failed add stock save order for agent ID ${agentID}`);
          return [];
        }
    }

    // remove stock save order 
    this.removeStockSaveOrder = async function (
      agentID,
      stockSymbol,
    ) {
        try {
          const sqlCommand = `DELETE FROM stockSaveOrder WHERE agentID=? AND stockSymbol=?`;
          
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, stockSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful remove stock save order for agent ID ${agentID}`)
          const queryResult = this.getStockSaveOrderList(agentID);
          return queryResult;
        } catch (error) {
          console.log(`Failed remove stock save order for agent ID ${agentID}`);
          return [];
        }
    }
}
    
module.exports = stockSaveOrderDBOperation;