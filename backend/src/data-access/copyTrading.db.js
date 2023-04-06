const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

function DBOperation(Agent) {
  this.Agent = Agent;

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

  this.searchAgentByID = async function (agentID) {
    try {
      const queryResult = await Agent.findById(agentID);
      return { success: true, data: queryResult };
    } catch (e) {
      return { success: false, error: e };
    }
  };

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
}
module.exports = agentDBOperation;
