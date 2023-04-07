const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const tradingAccountRouter = express.Router();

const { accountDBOperation } = require("../data-access/index.js");

tradingAccountRouter.post("/login", async (req, res) => {
  const { agentID, accountName, accountUsername, accountPassword } = req.body;

  try {
    // search for accountName
    var result = await accountDBOperation.searchAccountName(
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
    result = await accountDBOperation.searchAccountUsername(
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

    result = await accountDBOperation.createAccountItem(
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

        const result = await accountDBOperation.searchAccountByAgentID(agentID);

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
          res.status(422).json(err);
          return;
        } else {
          agentID = agentDoc.id;
          const result =
            await accountDBOperation.updateAccountByAccountConnection(
              agentID,
              accountName,
              accountConnection
            );

          if (result.success) {
            res.status(200).json("success");
            return;
          } else {
            res.status(422).json(result.error);
            return;
          }
        }
      });
    } catch (e) {
      res.status(422).json(e);
      return;
    }
  } else {
    res.json(null);
    return;
  }
});

tradingAccountRouter.post("/delete_account", async (req, res) => {
  const { token } = req.cookies;
  const { accountName } = req.body;

  if (token) {
    try {
      jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
        if (err) {
          res.status(422).json(err);
          return;
        } else {
          const agentID = agentDoc.id;

          const result = await accountDBOperation.deleteAccount(
            agentID,
            accountName
          );

          if (result.success) {
            res.status(200).json("success");
            return;
          } else {
            res.status(422).json(result.error);
            return;
          }
        }
      });
    } catch (e) {
      res.status(422).json(e);
      return;
    }
  } else {
    res.json(null);
    return;
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
