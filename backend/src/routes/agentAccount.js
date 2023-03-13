const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const agentAccountRouter = express.Router();

/* agent */

const Agent = require("../models/Agents.js");

agentAccountRouter.post("/register", async (req, res) => {
  const { agentUsername, agentPassword } = req.body;

  /*const agentID = new UUID().toBinary();*/

  try {
    const agentDoc = await Agent.create({
      agentUsername,
      agentPassword: bcrypt.hashSync(agentPassword, bcryptSalt),
    });
    res.json(agentDoc);
  } catch (e) {
    res.status(422).json(e);
  }
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
            email: agentDoc.email,
            id: agentDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(agentDoc);
          }
        );
      } else {
        res.status(422).json("incorrect password");
      }
    } else {
      res.status(422).json("agent not found");
    }
  } catch (e) {
    res.status(422).json(e);
  }
});

/*
agentAccountRouter.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});
*/

/*

agentAccountRouter.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});
*/

module.exports = agentAccountRouter;
