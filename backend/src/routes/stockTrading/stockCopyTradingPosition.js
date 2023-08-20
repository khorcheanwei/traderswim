const express = require("express");

const stockCopyTradingPositionRouter = express.Router();

const {
    stock_copy_trading_position_database,
} = require("../../controllers/stockTrading/stockCopyTradingPositionController.js");


stockCopyTradingPositionRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await stock_copy_trading_position_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

module.exports = stockCopyTradingPositionRouter;
