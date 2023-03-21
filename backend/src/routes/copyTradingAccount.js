const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const copyTradingAccountRouter = express.Router();
const request = require("request");

const Account = require("../models/Account.js");
const CopyTradingAccountModel = require("../models/CopyTradingAccount.js");

const redirect_uri = "";

const CopyTradingAccount = require("../models/CopyTradingAccount.js");

copyTradingAccountRouter.get("/test", (req, res) => {
  res.json("test ok");
});

copyTradingAccountRouter.post("/add_copier_account", (req, res) => {
  const {
    agentID,
    masterAccountID,
    copierAccountID,
    tradeRiskType,
    tradeRiskPercent,
  } = req.body;

  CopyTradingAccount.init().then(async () => {
    try {
      const copyTradingAccountDoc = await CopyTradingAccount.create({
        agentID: agentID,
        masterAccountID: masterAccountID,
        copierAccountID: copierAccountID,
        tradeRiskType: tradeRiskType,
        tradeRiskPercent: tradeRiskPercent,
      });
      res.status(200).json({ id: copyTradingAccountDoc._id });
    } catch (e) {
      res.status(422).json(e);
    }
  });
});

copyTradingAccountRouter.get("/database", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        agentID = agentDoc.id;

        const copyTradingAccountDoc = await CopyTradingAccount.find({
          agentID: agentID,
        });

        const copyTradingAccountMap = new Map();
        Object.keys(copyTradingAccountDoc).forEach(function (key, index) {
          copyTradingAccountMap.set(
            copyTradingAccountDoc[index].masterAccountID.toString(),
            ""
          );
          copyTradingAccountMap.set(
            copyTradingAccountDoc[index].copierAccountID.toString(),
            ""
          );
        });

        accountIDKeysList = [...copyTradingAccountMap.keys()];

        await Account.find()
          .where("_id")
          .in(accountIDKeysList)
          .then((accountDoc) => {
            Object.keys(accountDoc).forEach(function (key, index) {
              const accountID = accountDoc[index]._id.toString();
              if (copyTradingAccountMap.has(accountID)) {
                copyTradingAccountMap[accountID] =
                  accountDoc[index].accountName;
              }
            });
          })
          .catch((err) => {
            res.status(422).json(e);
            return;
          });

        copyTradingAccounArray = [];
        Object.keys(copyTradingAccountDoc).forEach(function (key, index) {
          // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

          copyTradingAccounArray.push({
            accountName:
              copyTradingAccountMap[
                copyTradingAccountDoc[index].masterAccountID
              ],
            accountBalance: 1000,
            copyFromMasterAccount:
              copyTradingAccountMap[
                copyTradingAccountDoc[index].copierAccountID
              ],
            tradeRiskType: copyTradingAccountDoc[index].tradeRiskType,
            tradeRiskPercent: copyTradingAccountDoc[index].tradeRiskPercent,
            accountConnection: copyTradingAccountDoc[index].accountName,
            accountStatus: copyTradingAccountDoc[index].accountName,
          });
        });

        res.status(200).json(copyTradingAccounArray);
      }
    });
  } else {
    res.json(null);
  }
});

/*
copyTradingAccountRouter.get("/database", (req, res) => {
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

copyTradingAccountRouter.post("/connection", (req, res) => {
  const { token } = req.cookies;
  const { accountName, accountConnection } = req.body;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        agentID = agentDoc.id;

        var query = { agentID: agentID, accountName: accountName };
        var updatedQuery = { accountConnection: accountConnection };

        try {
          await Account.updateOne(query, updatedQuery);
          res.status(200).json("success");
        } catch (e) {
          res.status(422).json(e);
        }
      }
    });
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

module.exports = copyTradingAccountRouter;
