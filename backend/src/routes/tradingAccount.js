const express = require("express");

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const tradingAccountRouter = express.Router();
const request = require("request");

const Account = require("../models/Account.js");

const redirect_uri = "";

tradingAccountRouter.get("/test", (req, res) => {
  res.json("test ok");
});

tradingAccountRouter.post("/login", (req, res) => {
  const { agentID, accountName, accountUsername, accountPassword } = req.body;

  Account.init().then(async () => {
    try {
      accountNameExist = await Account.exists({
        agentID: agentID,
        accountName: accountName,
      });
      accountUsernameExist = await Account.exists({
        agentID: agentID,
        accountUsername: accountUsername,
      });

      if (accountNameExist) {
        res.status(200).json("Account name exists for this agent");
      } else if (accountUsernameExist) {
        res.status(200).json("Trading account username exists for this agent");
      } else {
        const accountDoc = await Account.create({
          agentID,
          accountName,
          accountUsername,
          accountPassword: bcrypt.hashSync(accountPassword, bcryptSalt),
        });
      }

      res.status(200).json("Account is successfully login");
    } catch (e) {
      res.status(422).json(e);
    }
  });

  /*

  var authRequest = {
    url: "https://api.tdameritrade.com/v1/oauth2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "authorization_code",
      access_type: "offline",
      code: req.query.code,
      client_id: process.env.CLIENT_ID + "@AMER.OAUTHAP",
      redirect_uri: redirect_uri,
    },
  };

  // make the POST request
  request(authRequest, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var authReply = JSON.parse(body);
      res.send(authReply);
    }
  });
  */
});

module.exports = tradingAccountRouter;
