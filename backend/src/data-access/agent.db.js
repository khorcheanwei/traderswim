const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function agentDBOperation(trading_management_db) {
  this.trading_management_db = trading_management_db;

  // search whether Agent existed by AgentUsername
  this.searchAgentName = async function (agentUsername) {
    try {
      let tableExists = false;
      const sqlCommand = `SELECT EXISTS(SELECT 1 FROM agent WHERE agentUsername=?) AS rowExists;`

      const row = await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentUsername], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      if (row.rowExists) {
        tableExists = true;
      }
      return { success: true, data: tableExists };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search Agent by AgentUsername
  this.searchAgentByUsername = async function (agentUsername) {
    try {
      const sqlCommand = `SELECT * FROM agent WHERE agentUsername=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentUsername], (err, row) => {
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

  // search Agent by AgentID
  this.searchAgentByID = async function (agentID) {

    try {
      const sqlCommand = `SELECT * FROM agent WHERE id=?`;

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentID], (err, row) => {
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

  // get agentTradingSessionID based on AgentID
  this.searchAgentTradingSessionID = async function (agentID) {
    try {
      const sqlCommand = `SELECT * FROM agent WHERE id=?;`

      const queryResult = await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentID], (err, row) => {
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

  // create new Agent
  this.createAgentItem = async function (
    agentUsername,
    agentPassword
  ) {
    try {
      const sqlCommand = `INSERT INTO agent (agentUsername, agentPassword, agentTradingSessionID, agentIsTradingSession) VALUES (?, ?, ?, ?);`
      const agentTradingSessionID = 0;
      const agentIsTradingSession = false;
      agentPassword = bcrypt.hashSync(agentPassword, bcryptSalt)

      await new Promise((resolve, reject) => {
        this.trading_management_db.get(sqlCommand, [agentUsername, agentPassword, agentTradingSessionID, agentIsTradingSession], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return {success: true}

    } catch (error) {
      return { success: false, error: error };
    }
  };

  // update agentTradingSessionID in Agent
  this.updateAgentTradingSessionID = async function (
    agentID,
    agentTradingSessionID
  ) {
    try{  
      const agentIsTradingSession = true;
      const sqlCommand = `UPDATE agent SET agentTradingSessionID=?,agentIsTradingSession=? WHERE id=?`;

      await new Promise((resolve, reject) => {
        this.trading_management_db.all(sqlCommand, [agentTradingSessionID, agentIsTradingSession, agentID], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        });
      });
      return { success: true };

    } catch (error) {
      return { success: false, error: error };
    };
  };
}
module.exports = agentDBOperation;
