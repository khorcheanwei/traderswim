const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const agentAccountRouter = express.Router();

/* agent registration and authentication*/
const AgentModel = require("../models/Agent");
const agentDBOperation = require("../data-access/agent.db.js");
const newagentDBOperation = new agentDBOperation(AgentModel);

// create new agent
agentAccountRouter.post("/register", async (req, res) => {
  const { agentUsername, agentEmail, agentPassword } = req.body;

  try {
    // check if agentUsername existed
    var result = await newagentDBOperation.searchAgentName(agentUsername);
    if (result.success == true) {
      if (result.data != null) {
        res.status(200).json("This username is already registered");
        return;
      }
    } else {
      res.status(422).json(result.error);
      return;
    }

    // check if agentEmail existed
    result = await newagentDBOperation.searchAgentEmail(agentEmail);
    if (result.success == true) {
      if (result.data != null) {
        res.status(200).json("This email is already registered");
        return;
      }
    } else {
      res.status(422).json(result.error);
      return;
    }

    await newagentDBOperation.createAgentItem(
      agentUsername,
      agentEmail,
      agentPassword
    );

    res.status(200).json("User is successfully registered");
  } catch (error) {
    res.status(422).json(error);
  }
});

agentAccountRouter.post("/login", async (req, res) => {
  const { agentUsername, agentPassword } = req.body;

  try {
    const result = await newagentDBOperation.searchAgentByUsername(
      agentUsername
    );

    if (result.success == true) {
      const agentDocument = result.data;

      const passOk = bcrypt.compareSync(
        agentPassword,
        agentDocument.agentPassword
      );
      if (passOk) {
        jwt.sign(
          {
            id: agentDocument._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              throw err;
            } else {
              res.cookie("token", token).json(agentDocument);
            }
          }
        );
      } else {
        res.status(422).json("Incorrect password");
      }
    } else {
      res.status(422).json("Agent is not registered");
    }
  } catch (e) {
    res.status(422).json(e);
  }
});

agentAccountRouter.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        const result = await newagentDBOperation.searchAgentByID(agentDoc.id);
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
