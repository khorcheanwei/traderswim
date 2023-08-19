const express = require("express");

const stockCopyTradingRouter = express.Router();

const {
    stock_copy_trading_get_stock_quotes,
    stock_copy_trading_place_order
} = require("../../controllers/stockTrading/stockCopyTradingController.js");


/*
const {
  copy_trading_stock_pair_list,
  copy_trading_get_option_chain_list,
  copy_trading_place_order,
  copy_trading_database,
  copy_trading_history_database,
} = require("../controllers/copyTradingAccountController.js");

const {
  copy_trading_exit_order,
  copy_trading_replace_order,
  copy_trading_put_replace_order_individual,
  copy_trading_cancel_order,
  copy_trading_delete_cancel_order_individual
} = require("../controllers/copyTradingAccountUpdateController.js");
*/

// get all stock pair list
stockCopyTradingRouter.get(
  "/get_stock_quotes",
  async (httpRequest, httpResponse) => {
    const result = await stock_copy_trading_get_stock_quotes(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.post(
  "/place_order",
  async (httpRequest, httpResponse) => {
    const result = await stock_copy_trading_place_order(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

/*
stockCopyTradingRouter.post(
  "/exit_order",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_exit_order(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.put(
  "/replace_order",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_replace_order(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.put(
  "/replace_order_individual",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_put_replace_order_individual(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.delete(
  "/cancel_order",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_cancel_order(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.delete(
  "/cancel_order_individual",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_delete_cancel_order_individual(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.get(
  "/get_option_chain_list",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_get_option_chain_list(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

stockCopyTradingRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await copy_trading_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

stockCopyTradingRouter.get(
  "/trade_history_database",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_history_database(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
); */

module.exports = stockCopyTradingRouter;
