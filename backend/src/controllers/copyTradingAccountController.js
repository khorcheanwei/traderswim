const { agentDBOperation } = require("../data-access/index.js");

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

// Copy trading
async function agent_register(httpRequest) {
  const { agentUsername, agentEmail, agentPassword } = httpRequest.body;

  try {
    // check if agentUsername existed
    var dbQueryResult = await agentDBOperation.searchAgentName(agentUsername);

    // create new agent
    await agentDBOperation.createAgentItem(
      agentUsername,
      agentEmail,
      agentPassword
    );
    return { success: true, data: "User is successfully registered" };
  } catch (error) {
    return { success: false, data: error };
  }
}

module.exports = {
  agent_register,
};
