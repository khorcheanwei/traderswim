const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const {
  agentDBOperation,
  accountDBOperation,
  copyTradingAccountDBBOperation,
} = require("../data-access/index.js");

const copyTradingAccountRouter = express.Router();

const {
  copy_trading_place_order,
  copy_trading_database,
  copy_trading_history_database,
} = require("../controllers/copyTradingAccountController.js");

copyTradingAccountRouter.post(
  "/place_order",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_place_order(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

copyTradingAccountRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await copy_trading_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

copyTradingAccountRouter.get(
  "/trade_history_database",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_history_database(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

module.exports = copyTradingAccountRouter;
