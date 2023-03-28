const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const tradingStockRouter = express.Router();
const request = require("request");

const Account = require("../models/Account.js");

const redirect_uri = "";

const TradeActivity = require("../models/TradeActivity.js");

tradingStockRouter.get("/test", (req, res) => {
  res.json("test ok");
});

tradingStockRouter.post("/place_order", (req, res) => {
  console.log(req.body);

  const {
    agentID,
    stockName,
    stockTradeAction,
    stockTradeType,
    stockSharesTotal,
    stockPrice,
  } = req.body;

  TradeActivity.init().then(async () => {
    try {
      const tradeActivityDoc = await TradeActivity.create({
        agentID: agentID,
        accountID: accountID,
        stockName: stockName,
        leverage: stockTradeAction,
        entryPrice: stockPrice,
        orderQuantity: stockSharesTotal,
        filledQuantity: 0,
        orderDate: Date.now(),
      });
      res.status(200).json({ id: tradeActivityDoc._id });
    } catch (e) {
      res.status(422).json(e);
    }
  });

  /*
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
  */
});

module.exports = tradingStockRouter;
