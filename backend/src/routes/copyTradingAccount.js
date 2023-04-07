const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const copyTradingAccountRouter = express.Router();

/* agent registration and authentication*/
const AgentModel = require("../models/Agent");
const agentDBOperation = require("../data-access/agent.db.js");
const newagentDBOperation = new agentDBOperation(AgentModel);

const AccountModel = require("../models/Account");
const accountDBOperation = require("../data-access/account.db.js");
const newaccountDBOperation = new accountDBOperation(AccountModel);

const CopyTradingAccountModel = require("../models/CopyTradingAccount");
const copyTradingAccountDBOperation = require("../data-access/copyTrading.db.js");
const newcopyTradingAccountDBOperation = new copyTradingAccountDBOperation(
  CopyTradingAccountModel
);

const Agent = require("../models/Agent.js");
const Account = require("../models/Account.js");
const CopyTradingAccount = require("../models/CopyTradingAccount.js");

copyTradingAccountRouter.post("/place_order", async (req, res) => {
  const {
    agentID,
    stockName,
    stockTradeAction,
    stockTradeType,
    stockSharesTotal,
    stockEntryPrice,
  } = req.body;

  try {
    // get agent trading sessionID
    var result = await newagentDBOperation.searchAgentTradingSessionID(agentID);
    if (result.success != true) {
      res.status(422).json(result.error);
      return;
    }
    const agentsDocument = result.data;
    const agentTradingSessionID = agentsDocument.agentTradingSessionID + 1;

    // get all accountName of particular agentID
    result = await newaccountDBOperation.searchAccountNameByAgentID(agentID);
    if (result.success != true) {
      res.status(422).json(result.error);
      return;
    }
    const accountsDocument = result.data;
    result =
      await newcopyTradingAccountDBOperation.createCopyTradingAccountItem(
        accountsDocument,
        agentID,
        agentTradingSessionID,
        stockName,
        stockTradeAction,
        stockTradeType,
        stockEntryPrice,
        stockSharesTotal
      );
    if (result.success != true) {
      res.status(422).json(result.error);
      return;
    }

    result = await newagentDBOperation.updateAgentTradingSessionID(
      agentID,
      agentTradingSessionID
    );
    if (result.success != true) {
      res.status(422).json(result.error);
      return;
    }

    // save agentTradingSessionID and agentIsTradingSession to table Agent
    res.status(200).json("success");
  } catch (e) {
    res.status(422).json(e);
  }
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
        var result = await newagentDBOperation.searchAgentTradingSessionID(
          agentID
        );
        if (result.success != true) {
          res.status(422).json(result.error);
          return;
        }
        const agentsDocument = result.data;
        const agentTradingSessionID = agentsDocument.agentTradingSessionID;

        // get CopyTradingAccount based on agentID and agentTradingSessionID
        result =
          await newcopyTradingAccountDBOperation.searchCopyTradingAccountBasedTradingSessionID(
            agentID,
            agentTradingSessionID
          );

        if (result.success != true) {
          res.status(422).json(result.error);
          return;
        }
        copyTradingAccountsDocument = result.data;

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
            // get CopyTradingAccount based on agentID and agentTradingSessionID
            const result =
              await newcopyTradingAccountDBOperation.searchCopyTradingAccount(
                agentID
              );

            if (result.success != true) {
              res.status(422).json(result.error);
              return;
            }
            const copyTradingAccountsDocument = result.data;

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
