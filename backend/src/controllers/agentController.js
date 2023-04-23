const { agentDBOperation } = require("../data-access/index.js");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

// To register new agent
async function agent_register(httpRequest) {
  const { agentUsername, agentPassword } = httpRequest.body;

  try {
    
    // check if agentUsername existed
    var dbQueryResult = await agentDBOperation.searchAgentName(agentUsername);
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
              id: agentDocument.id,
            },
            jwtSecret,
            {}
          );
          return { success: true, data: agentDocument, token: token };
        } catch (error) {
          return { success: false, data: error };
        }
      } else {
        return { success: true, data: "Incorrect password" };
      }
    } else {
      return { success: true, data: "Agent is not registered" };
    }
  } catch (error) {
    return { success: false, data: error };
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
      return { success: false, data: error };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
  agent_register,
  agent_login,
  agent_profile,
};
