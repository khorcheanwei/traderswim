const express = require("express");

const stockRouter = express.Router();

const {
    get_stock_list,
    add_stock,
    remove_stock
} = require("../../controllers/stockTrading/stock/stockController.js");


stockRouter.get("/get_stock_list", async (httpRequest, httpResponse) => {
  const result = await get_stock_list(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

stockRouter.post("/add_stock", async (httpRequest, httpResponse) => {
  const result = await add_stock(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

stockRouter.delete("/remove_stock", async (httpRequest, httpResponse) => {
  const result = await remove_stock(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

module.exports = stockRouter;