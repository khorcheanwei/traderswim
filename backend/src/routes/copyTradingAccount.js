const express = require("express");

const copyTradingAccountRouter = express.Router();

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

// get all stock pair list
copyTradingAccountRouter.get(
  "/get_stock_pair_list",
  async (httpRequest, httpResponse) => {
    const result = await copy_trading_stock_pair_list();

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

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

copyTradingAccountRouter.post(
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

copyTradingAccountRouter.put(
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

copyTradingAccountRouter.put(
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

copyTradingAccountRouter.delete(
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

copyTradingAccountRouter.delete(
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

copyTradingAccountRouter.get(
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
