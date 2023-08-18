function stockDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // get stock list
    this.getStockList = async function (
        agentID,
    ) {
        try {
          const sqlCommand = `SELECT * FROM stock WHERE agentID=?`
  
          const queryResult = await new Promise((resolve, reject) => {
            this.trading_management_db.all(sqlCommand, [agentID], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful get stock list for agent ID ${agentID}`)
          return queryResult;
        } catch (error) {
          console.log(`Failed get stock list for agent ID ${agentID}`);
          return [];
        }
    }
  
    // add stock 
    this.addStock = async function (
      agentID,
      stockSymbol,
    ) {
        try {
          const sqlCommand = `INSERT INTO stock (agentID, stockSymbol) VALUES (?, ?)`;
  
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, stockSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful add stock for agent ID ${agentID}`)
          const queryResult = this.getStockList(agentID);
          return queryResult;
        } catch (error) {
          console.log(`Failed add stock for agent ID ${agentID}`);
          return [];
        }
    }
  
    // remove stock
    this.removeStock = async function (
      agentID,
      stockSymbol,
    ) {
        try {
          const sqlCommand = `DELETE FROM stock WHERE agentID=? AND stockSymbol=?`;
          
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, stockSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful remove stock for agent ID ${agentID}`)
          const queryResult = this.getStockList(agentID);
          return queryResult;
        } catch (error) {
          console.log(`Failed remove stock for agent ID ${agentID}`);
          return [];
        }
    }
  }
    
  module.exports = stockDBOperation;