const express = require("express");

const stockSaveOrderRouter = express.Router();

const {
    get_stock_save_order_list,
    add_stock_save_order,
    remove_stock_save_order
} = require("../../controllers/stockTrading/stockSaveOrder/stockSaveOrderController.js");


stockSaveOrderRouter.get("/get_stock_save_order_list", async (httpRequest, httpResponse) => {
  const result = await get_stock_save_order_list(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

stockSaveOrderRouter.post("/add_stock_save_order", async (httpRequest, httpResponse) => {
  const result = await add_stock_save_order(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

stockSaveOrderRouter.delete("/remove_stock_save_order", async (httpRequest, httpResponse) => {
  const result = await remove_stock_save_order(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

module.exports = stockSaveOrderRouter;