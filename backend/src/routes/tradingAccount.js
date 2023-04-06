const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const tradingAccountRouter = express.Router();

const Agent = require("../models/Agent.js");
const Account = require("../models/Account.js");
const CopyTradingAccount = require("../models/CopyTradingAccount.js");

const AccountModel = require("../models/Account");
const accountDBOperation = require("../data-access/account.db.js");

const newaccountDBOperation = new accountDBOperation(AccountModel);

tradingAccountRouter.post("/login", async (req, res) => {
  const { agentID, accountName, accountUsername, accountPassword } = req.body;

  try {
    // search for accountName
    var result = await newaccountDBOperation.searchAccountName(
      agentID,
      accountName
    );
    if (result.success == true) {
      const accountNameExist = result.data;
      if (accountNameExist) {
        res.status(200).json("Account name exists for this agent");
        return;
      }
    } else {
      res.status(422).json(result.error);
      return;
    }

    // search for accountUsername
    result = await newaccountDBOperation.searchAccountUsername(
      agentID,
      accountUsername
    );
    if (result.success == true) {
      const accountUsernameExist = result.data;
      if (accountUsernameExist) {
        res.status(200).json("Trading account username exists for this agent");
        return;
      }
    } else {
      res.status(422).json(result.error);
      return;
    }

    result = await newaccountDBOperation.createAccountItem(
      agentID,
      accountName,
      accountUsername,
      accountPassword
    );

    if (result.success) {
      res.status(200).json({ accountName });
    } else {
      res.status(422).json(result.error);
    }
  } catch (e) {
    res.status(422).json(e);
  }
});

tradingAccountRouter.get("/database", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        agentID = agentDoc.id;

        const result = await newaccountDBOperation.searchAccountByAgentID(
          agentID
        );

        if (result.success) {
          const accountDocument = result.data;
          accountTableArray = [];
          Object.keys(accountDocument).forEach(function (key, index) {
            // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

            accountTableArray.push({
              accountName: accountDocument[index].accountName,
              accountBalance: 1000, //hard code for now
              //accountConnection: accountDoc[index].accountConnection,
              accountConnection: accountDocument[index].accountConnection,
              accountStatus: accountDocument[index].accountConnection,
            });
          });
          res.status(200).json(accountTableArray);
        } else {
          res.status(422).json(result.error);
        }
      }
    });
  } else {
    res.json(null);
  }
});

tradingAccountRouter.post("/connection", async (req, res) => {
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

tradingAccountRouter.post("/delete_account", async (req, res) => {
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
