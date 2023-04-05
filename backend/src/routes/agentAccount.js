const express = require("express");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const jwtSecret = process.env.JWTSECRET;

const bcryptSalt = bcrypt.genSaltSync(12);

const agentAccountRouter = express.Router();

/* agent registration and authentication*/
agentAccountRouter.post("agent_account/register", async (req, res) => {
  // Register agent
  const { agentUsername, agentEmail, agentPassword } = req.body;

  Agent.init().then(async () => {
    try {
      agentDB.createAgentItem({
        agentUsername,
        agentEmail,
        agentPassword,
      });
      res.status(200).json("User is successfully registered");
    } catch (e) {
      if (
        e.keyValue["agentUsername"] != undefined &&
        e.keyValue["agentUsername"] == agentUsername
      ) {
        res.status(200).json("This username is already registered");
      } else if (
        e.keyValue["agentEmail"] != undefined &&
        e.keyValue["agentEmail"] == agentEmail
      ) {
        res.status(200).json("This email is already registered");
      } else {
        res.status(422).json(e);
      }
    }
  });
});

agentAccountRouter.post("/login", async (req, res) => {
  const { agentUsername, agentPassword } = req.body;

  try {
    const agentDoc = await Agent.findOne({ agentUsername });
    if (agentDoc) {
      const passOk = bcrypt.compareSync(agentPassword, agentDoc.agentPassword);
      if (passOk) {
        jwt.sign(
          {
            id: agentDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              throw err;
            } else {
              res.cookie("token", token).json(agentDoc);
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
        const { _id, agentUsername } = await Agent.findById(agentDoc.id);
        agentID = _id;
        res.json({ agentID, agentUsername });
      }
    });
  } else {
    res.json(null);
  }
});

module.exports = agentAccountRouter;
