const express = require("express");

const copyTradingPositionAccountRouter = express.Router();

const {
  copy_trading_position_database,
} = require("../controllers/copyTradingPositionAccountController.js");


copyTradingPositionAccountRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await copy_trading_position_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

module.exports = copyTradingPositionAccountRouter;
