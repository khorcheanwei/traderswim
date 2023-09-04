function optionContractSaveOrderDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;

    // get option contract save order list
    this.getOptionContractSaveOrder = async function (
      agentID,
  ) {
      try {
        const sqlCommand = `SELECT * FROM optionContractSaveOrder`;

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
      optionChainDescription, 
      optionChainInstruction, 
      optionChainOrderType, 
      optionChainQuantity, 
      optionChainPrice
    ) {
        try {
          const sqlCommand = `INSERT OR REPLACE INTO optionContractSaveOrder (agentID, optionChainSymbol, optionChainDescription, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice) VALUES (?, ?, ?, ?, ?, ?, ?)`;

          await new Promise((resolve, reject) => {
            this.trading_management_db.get(sqlCommand, [agentID, optionChainSymbol, optionChainDescription, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice], (err, row) => {
              if (err) {
                reject(err);
              } else {
                resolve(row);
              }
            });
          });
          console.log(`Successful add option contract save order for agent ID ${agentID}`)

          const queryResult = this.getOptionContractSaveOrderList(agentID);
          return queryResult;
        } catch (error) {
          console.log(`Failed add option contract save order for agent ID ${agentID}`);
          return [];
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
          const queryResult = this.getOptionContractSaveOrderList(agentID);
          return queryResult;
        } catch (error) {
          console.log(`Failed remove option contract save order for agent ID ${agentID}`);
          return [];
        }
    }

    this.removeOptionContractsByIdList = async function(optionContractSaveOrderDeleteList) {
      try {
          // SQL command to delete option contracts by ID list
          const placeholders = optionContractSaveOrderDeleteList.map(() => '?').join(',');
          const sqlCommand = `DELETE FROM optionContractSaveOrder WHERE id IN (${placeholders})`;
  
          const params = optionContractSaveOrderDeleteList;
  
          // Use a Promise to perform the SQL query
          await new Promise((resolve, reject) => {
              this.trading_management_db.run(sqlCommand, params, function (err) {
                  if (err) {
                      reject(err);
                  } else {
                      resolve(this.changes);
                  }
              });
          });
  
          console.log(`Successfully removed option contracts based on ${optionContractSaveOrderDeleteList.join(',')}`);
      } catch (error) {
          console.log(`Failed to remove option contracts based on ${optionContractSaveOrderDeleteList.join(',')}`);
      }
  }
  

    
}
    
module.exports = optionContractSaveOrderDBOperation;