function optionContractDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // get option contract list
    this.getOptionContractList = async function (
        agentID,
    ) {
        try {
          const sqlCommand = `SELECT * FROM optionContract WHERE agentID=?`
  
          const queryResult = await new Promise((resolve, reject) => {
            this.trading_management_db.all(sqlCommand, [agentID], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful get option contract list for agent ID ${agentID}`)
          return queryResult;
        } catch (error) {
          console.log(`Failed get option contract list for agent ID ${agentID}`);
          return [];
        }
    }

    // add option contract 
    this.addOptionContract = async function (
      agentID,
      optionChainSymbol,
    ) {
        try {
          const sqlCommand = `INSERT INTO optionContract (agentID, optionChainSymbol) VALUES (?, ?)`;

          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, optionChainSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful add option contract for agent ID ${agentID}`)
          return true;
        } catch (error) {
          console.log(`Failed add option contract for agent ID ${agentID}`);
          return false;
        }
    }

    // remove option contract
    this.removeOptionContract = async function (
      agentID,
      optionChainSymbol,
    ) {
        try {
          const sqlCommand = `DELETE FROM optionContract WHERE agentID=? AND optionChainSymbol=?`;
          
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, optionChainSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful remove option contract for agent ID ${agentID}`)
          return true;
        } catch (error) {
          console.log(`Failed remove option contract for agent ID ${agentID}`);
          return false;
        }
    }
}
    
module.exports = optionContractDBOperation;