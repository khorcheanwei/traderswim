const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function agentDBOperation(trading_management_db) {
  this.trading_management_db = trading_management_db;

  // search whether Agent existed by AgentUsername
  this.searchAgentName = async function (agentUsername) {
    try {
      const queryResult = await this.trading_management_db.exists({
        agentUsername: agentUsername,
      });
      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search whether Agent existed by AgentEmail
  this.searchAgentEmail = async function (agentEmail) {
    try {
      const queryResult = await this.trading_management_db.exists({
        agentEmail: agentEmail,
      });
      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search Agent by AgentUsername
  this.searchAgentByUsername = async function (agentUsername) {
    try {
      const queryResult = await this.trading_management_db.findOne({
        agentUsername: agentUsername,
      });
      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // search Agent by AgentID
  this.searchAgentByID = async function (agentID) {
    try {
      const queryResult = await trading_management_db.findById(agentID);
      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // get agentTradingSessionID based on AgentID
  this.searchAgentTradingSessionID = async function (agentID) {
    try {
      const queryResult = await trading_management_db.findOne(
        { _id: agentID },
        {
          agentTradingSessionID: 1,
        }
      );
      return { success: true, data: queryResult };
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // create new Agent
  this.createAgentItem = async function (
    agentUsername,
    agentEmail,
    agentPassword
  ) {
    try {
      const sqlCommand = `insert into hero (agentUsername, agentEmail, agentPassword, agentTradingSessionID, agentIsTradingSession)
                          values ('agent_a', 'agent_a@gmail.com', '1', '1');`

      await this.trading_management_db.exec(sqlCommand)
    } catch (error) {
      return { success: false, error: error };
    }
  };

  // update agentTradingSessionID in Agent
  this.updateAgentTradingSessionID = async function (
    agentID,
    agentTradingSessionID
  ) {
    try {
      var query = { _id: agentID };
      var updatedQuery = {
        agentTradingSessionID: agentTradingSessionID,
        agentIsTradingSession: true,
      };
      await trading_management_db.updateOne(query, updatedQuery);

      return { success: true };
    } catch (error) {
      return { success: false, error: error };
    }
  };
}
module.exports = agentDBOperation;
