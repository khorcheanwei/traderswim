const express = require("express");

const tradingAccountRouter = express.Router();

const {
  account_login,
  fetch_trading_account_info,
  account_update_trading_active,
  account_database,
  account_delete,
} = require("../controllers/tradingAccountController.js");

tradingAccountRouter.post("/login", async (httpRequest, httpResponse) => {
  const result = await account_login(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.post("/account_fetch", async (httpRequest, httpResponse) => {
  // axios is asynchronous request
  await fetch_trading_account_info(httpRequest, httpResponse);
});

tradingAccountRouter.post("/trading_active", async (httpRequest, httpResponse) => {
  const result = await account_update_trading_active(httpRequest, httpResponse);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await account_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.post("/delete_account", async (httpRequest, httpResponse) => {
  const result = await account_delete(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
}
);

module.exports = tradingAccountRouter;
