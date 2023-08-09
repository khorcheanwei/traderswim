function optionContractSaveOrderDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // get option contract save order list
    this.getOptionContractSaveOrderList = async function (
        agentID,
    ) {
        try {
          const sqlCommand = `SELECT * FROM optionContractSaveOrder WHERE agentID=?`
  
          const queryResult = await new Promise((resolve, reject) => {
            this.trading_management_db.all(sqlCommand, [agentID], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful get option contract save order list for agent ID ${agentID}`)
          return queryResult;
        } catch (error) {
          console.log(`Failed get option contract save order list for agent ID ${agentID}`);
          return [];
        }
    }

    // add option contract save order
    this.addOptionContractSaveOrder = async function (
      agentID,
      optionChainSymbol,
    ) {
        try {
          const sqlCommand = `INSERT INTO optionContractSaveOrder (agentID, optionChainSymbol) VALUES (?, ?)`;

          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, optionChainSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful add option contract save order for agent ID ${agentID}`)
          return true;
        } catch (error) {
          console.log(`Failed add option contract save order for agent ID ${agentID}`);
          return false;
        }
    }

    // remove option contract save order 
    this.removeOptionContractSaveOrder = async function (
      agentID,
      optionChainSymbol,
    ) {
        try {
          const sqlCommand = `DELETE FROM optionContractSaveOrder WHERE agentID=? AND optionChainSymbol=?`;
          
          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, optionChainSymbol], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful remove option contract save order for agent ID ${agentID}`)
          return true;
        } catch (error) {
          console.log(`Failed remove option contract save order for agent ID ${agentID}`);
          return false;
        }
    }
}
    
module.exports = optionContractSaveOrderDBOperation;