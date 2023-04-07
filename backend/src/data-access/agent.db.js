const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function agentDBOperation(Agent) {
  this.Agent = Agent;

  // search whether Agent existed by AgentUsername
  this.searchAgentName = async function (agentUsername) {
    try {
      const queryResult = await this.Agent.exists({
        agentUsername: agentUsername,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search whether Agent existed by AgentEmail
  this.searchAgentEmail = async function (agentEmail) {
    try {
      const queryResult = await this.Agent.exists({
        agentEmail: agentEmail,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search Agent by AgentUsername
  this.searchAgentByUsername = async function (agentUsername) {
    try {
      const queryResult = await this.Agent.findOne({
        agentUsername: agentUsername,
      });
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // search Agent by AgentID
  this.searchAgentByID = async function (agentID) {
    try {
      const queryResult = await Agent.findById(agentID);
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // get agentTradingSessionID based on AgentID
  this.searchAgentTradingSessionID = async function (agentID) {
    try {
      const queryResult = await Agent.findOne(
        { _id: agentID },
        {
          agentTradingSessionID: 1,
        }
      );
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

  // create new Agent
  this.createAgentItem = async function (
    agentUsername,
    agentEmail,
    agentPassword
  ) {
    try {
      await this.Agent.create({
        agentUsername: agentUsername,
        agentEmail: agentEmail,
        agentPassword: bcrypt.hashSync(agentPassword, bcryptSalt),
        agentTradingSessionID: 0,
        agentIsTradingSession: false,
      });
      return result;
    } catch (e) {
      return { success: false, error: e };
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
      await Agent.updateOne(query, updatedQuery);

      return { success: true };
    } catch (e) {
      return { success: false, error: e };
    }
  };
}
module.exports = agentDBOperation;
