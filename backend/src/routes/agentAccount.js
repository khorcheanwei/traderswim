const express = require("express");

const { UUID } = require("bson");

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const agentAccountRouter = express.Router();

const Agent = require("../models/Agents.js");

agentAccountRouter.post("/register", async (req, res) => {
  const { agentUsername, agentPassword } = req.body;

  const agentID = UUID().toBinary();

  try {
    const agentDoc = await Agent.create({
      agentID,
      agentUsername,
      agentPassword: bcrypt.hashSync(agentPassword, bcryptSalt),
    });
    res.json(agentDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

/*

agentAccountRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("json not ok");
      }
    } else {
      res.status(422).json("not found");
    }
  } catch (e) {
    res.status(422).json(e);
  }
});

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

agentAccountRouter.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});
*/

module.exports = agentAccountRouter;
