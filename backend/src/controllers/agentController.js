const { agentDBOperation } = require("../data-access/index.js");
const { store_agent_list_to_cache, delete_agent_list_from_cache } = require("./tradingAccountCronJob.js")

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

// To register new agent
async function agent_register(httpRequest) {
  const { agentUsername, agentPassword } = httpRequest.body;

  try {

    // check if agentUsername existed
    let dbQueryResult = await agentDBOperation.searchAgentName(agentUsername);
    if (dbQueryResult.success == true) {
      if (dbQueryResult.data) {
        return { success: true, data: "This username is already registered" };
      }
    } else {
      return { success: false, data: dbQueryResult.error };
    }

    // create new agent
    dbQueryResult = await agentDBOperation.createAgentItem(
      agentUsername,
      agentPassword
    );
    if (dbQueryResult.success) {
      return { success: true, data: "User is successfully registered" };
    } else {
      return { success: false, data: dbQueryResult.error };
    }

  } catch (error) {
    return { success: false, data: error.message };
  }
}

// Agent login
async function agent_login(httpRequest) {
  const { agentUsername, agentPassword } = httpRequest.body;
  try {
    let dbQueryResult = await agentDBOperation.searchAgentByUsername(
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
              id: agentDocument.id,
            },
            jwtSecret,
            {}
          );
          // store agent ID to agent list in cache
          store_agent_list_to_cache(agentDocument.id)
          return { success: true, data: agentDocument, token: token };
        } catch (error) {
          return { success: false, data: error.message };
        }
      } else {
        return { success: true, data: "Incorrect password" };
      }
    } else {
      return { success: true, data: "Agent is not registered" };
    }
  } catch (error) {
    return { success: false, data: error.message };
  }
}

// agent logout 
async function agent_logout(httpRequest) {
  const { token } = httpRequest.cookies;


  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      // delete agent ID from agent list in cache
      delete_agent_list_from_cache(agentDocument.id);
      return { success: true };
    } catch (error) {
      return { success: false, data: error.message.message };
    }
  }
}

// agent get profile
async function agent_profile(httpRequest) {
  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = await jwt.verify(token, jwtSecret, {});
      const dbQueryResult = await agentDBOperation.searchAgentByID(agentDocument.id);
      if (dbQueryResult.success) {
        const { id, agentUsername } = dbQueryResult.data;
        return {
          success: true,
          data: { agentID: id, agentUsername: agentUsername },
        };
      } else {
        return { success: false, data: dbQueryResult.error };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
  agent_register,
  agent_login,
  agent_logout,
  agent_profile,
};
