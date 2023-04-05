const express = require("express");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWTSECRET;

const copyTradingAccountRouter = express.Router();

const Agent = require("../models/agent.model.js");
const Account = require("../models/Account.js");
const CopyTradingAccount = require("../models/CopyTradingAccount.js");

copyTradingAccountRouter.get("/accont_name_list", async (req, res) => {
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

copyTradingAccountRouter.post("/place_order", async (req, res) => {
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

copyTradingAccountRouter.get("/database", async (req, res) => {
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
            stockPair:
              currCopyTradingAccount.stockName +
              "/" +
              currCopyTradingAccount.stockEntryPriceCurrency,
            stockTradeAction: currCopyTradingAccount.stockTradeAction,
            entryPrice: currCopyTradingAccount.stockEntryPrice,
            orderQuantity: currCopyTradingAccount.orderQuantity,
            filledQuantity: currCopyTradingAccount.filledQuantity,
            orderDate: currCopyTradingAccount.orderDate.toLocaleString("en-US"),
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

copyTradingAccountRouter.get("/trade_history_database", async (req, res) => {
  const { token } = req.cookies;

  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, agentDoc) => {
      if (err) {
        throw err;
      } else {
        agentID = agentDoc.id;
        CopyTradingAccount.init().then(async () => {
          try {
            // get all trading history
            const copyTradingAccountsDocument = await CopyTradingAccount.find({
              agentID: agentID,
            });

            var tradeHistoryData = [];

            for (
              let index = copyTradingAccountsDocument.length - 1;
              0 <= index;
              index--
            ) {
              const currCopyTradingAccount = copyTradingAccountsDocument[index];

              tradeHistoryData.push({
                agentTradingSessionID:
                  currCopyTradingAccount.agentTradingSessionID,
                accountName: currCopyTradingAccount.accountName,
                stockPair:
                  currCopyTradingAccount.stockName +
                  "/" +
                  currCopyTradingAccount.stockEntryPriceCurrency,
                stockTradeAction: currCopyTradingAccount.stockTradeAction,
                entryPrice: currCopyTradingAccount.stockEntryPrice,
                orderQuantity: currCopyTradingAccount.orderQuantity,
                filledQuantity: currCopyTradingAccount.filledQuantity,
                orderDate:
                  currCopyTradingAccount.orderDate.toLocaleString("en-US"),
              });
            }
            res.status(200).json(tradeHistoryData);
          } catch (e) {
            res.status(422).json(e);
          }
        });
      }
    });
  } else {
    res.json(null);
  }
});

module.exports = copyTradingAccountRouter;
