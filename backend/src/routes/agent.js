const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const agentAccountRouter = express.Router();

const {
  agent_register,
  agent_login,
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
    httpResponse.status(400).json(result.data);
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
