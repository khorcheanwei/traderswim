const express = require("express");

const agentAccountRouter = express.Router();

const {
  agent_register,
  agent_login,
  agent_logout,
  agent_profile,
} = require("../controllers/agentController.js");

// register new agent
agentAccountRouter.post("/register", async (httpRequest, httpResponse) => {
  const result = await agent_register(httpRequest);
  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

// login agent
agentAccountRouter.post("/login", async (httpRequest, httpResponse) => {
  const result = await agent_login(httpRequest);

  if (result.success == true) {
    httpResponse.cookie("token", result.token).json(result.data);
  } else {
    console.log(result.data)
    httpResponse.status(400).json(result.data);
  }
});

// logout agent
agentAccountRouter.post("/logout", async (httpRequest, httpResponse) => {
  const result = await agent_logout(httpRequest);

  if (result.success == true) {
    httpResponse.cookie("token", "").json(true);
  } else {
    httpResponse.status(400).json("Failed to logout");
  }
});

// get agent profile
agentAccountRouter.get("/profile", async (httpRequest, httpResponse) => {
  const result = await agent_profile(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

module.exports = agentAccountRouter;
