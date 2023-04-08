const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const agentAccountRouter = express.Router();

const { agentDBOperation } = require("../data-access/index.js");
const {
  agent_register,
  agent_login,
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

agentAccountRouter.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        const result = await agentDBOperation.searchAgentByID(agentDoc.id);
        if (result.success) {
          const { _id, agentUsername } = result.data;
          res.json({ agentID: _id, agentUsername: agentUsername });
        } else {
          res.json(422).json(result.error);
        }
      }
    });
  } else {
    res.json(null);
  }
});

module.exports = agentAccountRouter;
