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

const Agent = require("../models/Agent.js");
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

copyTradingAccountRouter.get("/accont_name_list", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        try {
          agentID = agentDoc.id;

          const accountDoc = await Account.find(
            {
              agentID: agentID,
            },
            { _id: 1, accountName: 1 }
          );

          const copyTradingAccountDoc = await CopyTradingAccount.find(
            { agentID: agentID },
            { masterAccountID: 1, copierAccountID: 1 }
          );

          // create accountIDToNameMap with key agentID and value accountName
          const accountIDToNameMap = new Map();
          Object.keys(accountDoc).forEach(function (key, index) {
            accountIDToNameMap.set(
              accountDoc[index]._id.toString(),
              accountDoc[index].accountName
            );
          });

          // create masterAccountSet and copierAccountNameSet from CopyTradingAccount table
          var masterAccountNameSet = new Set();
          var copierAccountNameSet = new Set();

          Object.keys(copyTradingAccountDoc).forEach(function (key, index) {
            const currMasterAccountID =
              copyTradingAccountDoc[index].masterAccountID.toString();
            const currCopierAccountID =
              copyTradingAccountDoc[index].copierAccountID.toString();

            masterAccountNameSet.add(
              accountIDToNameMap.get(currMasterAccountID)
            );
            copierAccountNameSet.add(
              accountIDToNameMap.get(currCopierAccountID)
            );
          });

          // Ensure masterAccount is always in masterAccountList
          // Ensure already added copierAccount in CopyTradingAccount table not in copierAccountList
          var masterAccountList = [];
          var copierAccountList = [];

          Object.keys(accountDoc).forEach(function (key, index) {
            const currAccountID = accountDoc[index]._id.toString();
            const currAccountName = accountDoc[index].accountName;

            if (masterAccountNameSet.has(currAccountName)) {
              masterAccountList.push({
                _id: currAccountID,
                accountName: accountIDToNameMap.get(currAccountID),
              });
            } else {
              if (copierAccountNameSet.has(currAccountName) == false) {
                masterAccountList.push({
                  _id: currAccountID,
                  accountName: accountIDToNameMap.get(currAccountID),
                });
                copierAccountList.push({
                  _id: currAccountID,
                  accountName: accountIDToNameMap.get(currAccountID),
                });
              }
            }
          });

          // remove account from masterAccountList if there is ony one account in copierAccountList
          if (copierAccountList.length == 1) {
            masterAccountList = masterAccountList.filter(
              (account) =>
                account.accountName !== copierAccountList[0].accountName
            );
          }

          res.status(200).json([masterAccountList, copierAccountList]);
        } catch (e) {
          res.status(422).json(e);
        }
      }
    });
  } else {
    res.json(null);
  }
});

copyTradingAccountRouter.post("/place_order", (req, res) => {
  console.log(req.body);

  const {
    agentID,
    stockName,
    stockTradeAction,
    stockTradeType,
    stockSharesTotal,
    stockEntryPrice,
  } = req.body;

  CopyTradingAccount.init().then(async () => {
    try {
      // get agent trading sessionID
      const agentsDocument = await Agent.findOne(
        { _id: agentID },
        {
          agentTradingSessionID: 1,
        }
      );

      // get all accounts of particular agent
      const agentTradingSessionID = agentsDocument.agentTradingSessionID + 1;
      const accountsDocument = await Account.find(
        { agentID: agentID },
        {
          _id: 1,
          accountName: 1,
        }
      );

      Object.keys(accountsDocument).forEach(async function (key, index) {
        await CopyTradingAccount.create({
          agentID: agentID,
          agentTradingSessionID: agentTradingSessionID,
          accountID: accountsDocument[index]._id,
          accountName: accountsDocument[index].accountName,
          stockName: stockName,
          stockTradeAction: stockTradeAction,
          stockTradeType: stockTradeType,
          stockEntryPrice: stockEntryPrice,
          stockEntryPriceCurrency: "USD",
          orderQuantity: stockSharesTotal,
          filledQuantity: 0,
          orderDate: Date.now(),
        });
      });

      var query = { _id: agentID };
      var updatedQuery = {
        agentTradingSessionID: agentTradingSessionID,
        agentIsTradingSession: true,
      };

      await Agent.updateOne(query, updatedQuery);

      // save agentTradingSessionID and agentIsTradingSession to table Agent
      res.status(200).json("success");
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

        // get agent trading sessionID
        const agentsDocument = await Agent.findOne(
          { _id: agentID },
          {
            agentTradingSessionID: 1,
          }
        );

        const agentTradingSessionID = agentsDocument.agentTradingSessionID;

        // get agent trading sessionID
        const copyTradingAccountsDocument = await CopyTradingAccount.find({
          agentID: agentID,
          agentTradingSessionID: agentTradingSessionID,
        });

        var copyTradingAccountData = [];

        for (
          let index = 0;
          index < copyTradingAccountsDocument.length;
          index++
        ) {
          const currCopyTradingAccount = copyTradingAccountsDocument[index];
          copyTradingAccountData.push({
            accountName: currCopyTradingAccount.accountName,
            stockPair: currCopyTradingAccount.stockName,
            leverage: "1X LONG",
            entryPrice: currCopyTradingAccount.stockEntryPrice,
            orderQuantity: currCopyTradingAccount.orderQuantity,
            filledQuantity: currCopyTradingAccount.filledQuantity,
            orderDate: currCopyTradingAccount.orderDate,
            placeNewOrder: "",
          });
        }

        res.status(200).json(copyTradingAccountData);
      }
    });
  } else {
    res.json(null);
  }
});

/*
copyTradingAccountRouter.post("/delete_account", (req, res) => {
  const { token } = req.cookies;
  const { accountName } = req.body;

  if (token) {
    try {
      jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
        if (err) {
          throw err;
        } else {
          agentID = agentDoc.id;

          // search accountID in account table
          var accountQuery = {
            agentID: agentID,
            accountName: accountName,
          };
          const accountID = await Account.findOne(accountQuery, {
            _id: 1,
          });

          // delete account in copyTrading table
          var copyTradingquery = {
            copierAccountID: accountID,
          };
          await CopyTradingAccount.deleteOne(copyTradingquery);

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
*/
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
