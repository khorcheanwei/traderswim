function copyTradingPositionDBOperation(trading_management_db) {
    this.trading_management_db = trading_management_db;
  
    // search searchCopyTradingAccount based on agentID
    this.searchOptionChainSymbolBasedAgentID = async function (
      agentID
    ) {
  
      try {
        const sqlCommand = `SELECT optionChainSymbol FROM copyTradingPosition WHERE agentID=?`;
  
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
  
  module.exports = copyTradingPositionDBOperation;
  