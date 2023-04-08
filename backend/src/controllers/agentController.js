const { agentDBOperation } = require("../data-access/index.js");

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

// To register new agent
async function agent_register(httpRequest) {
  const { agentUsername, agentEmail, agentPassword } = httpRequest.body;

  try {
    // check if agentUsername existed
    var dbQueryResult = await agentDBOperation.searchAgentName(agentUsername);
    if (dbQueryResult.success == true) {
      if (dbQueryResult.data != null) {
        return { success: true, data: "This username is already registered" };
      }
    } else {
      return { success: false, data: dbQueryResult.error };
    }

    // check if agentEmail existed
    dbQueryResult = await agentDBOperation.searchAgentEmail(agentEmail);
    if (dbQueryResult.success == true) {
      if (dbQueryResult.data != null) {
        return { success: true, data: "This email is already registered" };
      }
    } else {
      return { success: false, data: dbQueryResult.error };
    }

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

// Agent login
async function agent_login(httpRequest) {
  const { agentUsername, agentPassword } = httpRequest.body;
  try {
    var dbQueryResult = await agentDBOperation.searchAgentByUsername(
      agentUsername
    );

    if (dbQueryResult.success == true && dbQueryResult.data != null) {
      const agentDocument = dbQueryResult.data;

      const passOk = bcrypt.compareSync(
        agentPassword,
        agentDocument.agentPassword
      );
      if (passOk) {
        try {
          const token = await jwt.sign(
            {
              id: agentDocument._id,
            },
            jwtSecret,
            {}
          );
          return { success: true, data: agentDocument, token: token };
        } catch (error) {
          return { success: false, data: error };
        }
      } else {
        return { success: false, data: "Incorrect password" };
      }
    } else {
      return { success: false, data: "Agent is not registered" };
    }
  } catch (error) {
    return { success: false, data: error };
  }
}

module.exports = {
  agent_register,
  agent_login,
};
