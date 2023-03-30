const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const tradingAccountRouter = express.Router();
const request = require("request");

const Agent = require("../models/Agent.js");
const Account = require("../models/Account.js");
const CopyTradingAccount = require("../models/CopyTradingAccount.js");

const redirect_uri = "";

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
        try {
          // search for agentID first before creating login account
          Agent.findOne({ _id: agentID }).then(async (doc) => {
            if (!doc) {
              res.status(422).json("Failed to find agentID");
            } else {
              var accountConnection = true;
              const accountDoc = await Account.create({
                agentID: agentID,
                accountName: accountName,
                accountConnection: accountConnection,
                accountUsername: accountUsername,
                accountPassword: bcrypt.hashSync(accountPassword, bcryptSalt),
              });
              res.status(200).json({ accountName });
            }
          });
        } catch (e) {
          res.status(422).json(e);
        }
      }
    } catch (e) {
      res.status(422).json(e);
    }
  });
});

tradingAccountRouter.get("/database", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        agentID = agentDoc.id;

        const accountDoc = await Account.find({
          agentID: agentID,
        });

        accountTableArray = [];
        Object.keys(accountDoc).forEach(function (key, index) {
          // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

          accountTableArray.push({
            accountName: accountDoc[index].accountName,
            accountBalance: 1000, //hard code for now
            //accountConnection: accountDoc[index].accountConnection,
            accountConnection: accountDoc[index].accountConnection,
            accountStatus: accountDoc[index].accountConnection,
          });
        });
        res.status(200).json(accountTableArray);
      }
    });
  } else {
    res.json(null);
  }
});

tradingAccountRouter.post("/connection", (req, res) => {
  const { token } = req.cookies;
  const { accountName, accountConnection } = req.body;

  if (token) {
    try {
      jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
        if (err) {
          throw err;
        } else {
          agentID = agentDoc.id;

          var query = { agentID: agentID, accountName: accountName };
          var updatedQuery = { accountConnection: accountConnection };

          await Account.updateOne(query, updatedQuery);
          res.status(200).json("success");
        }
      });
    } catch (e) {
      res.status(422).json(e);
    }
  } else {
    res.json(null);
  }
});

tradingAccountRouter.post("/delete_account", (req, res) => {
  const { token } = req.cookies;
  const { accountName } = req.body;

  if (token) {
    try {
      jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
        if (err) {
          throw err;
        } else {
          agentID = agentDoc.id;

          // delete accountName in account table
          var accountQuery = { agentID: agentID, accountName: accountName };
          const accountID = await Account.findOne(accountQuery, {
            _id: 1,
          });
          await Account.deleteOne({ _id: accountID });

          // delete account in copyTrading table
          var copyTradingquery = {
            $or: [
              { masterAccountID: accountID },
              { copierAccountID: accountID },
            ],
          };
          await CopyTradingAccount.deleteMany(copyTradingquery);

          res.status(200).json("success");
        }
      });
    } catch (e) {
      res.status(422).json(e);
    }
  } else {
    res.json(null);
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

module.exports = tradingAccountRouter;
