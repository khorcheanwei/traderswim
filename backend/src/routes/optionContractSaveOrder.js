const express = require("express");

const optionContractSaveOrderRouter = express.Router();

const {
    get_option_contract_save_order_list,
    add_option_contract_save_order,
    remove_option_contract_save_order
} = require("../controllers/optionContractSaveOrder/optionContractSaveOrderController.js");


optionContractSaveOrderRouter.get("/get_option_contract_save_order_list", async (httpRequest, httpResponse) => {
  const result = await get_option_contract_save_order_list(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

optionContractSaveOrderRouter.post("/add_option_contract_save_order", async (httpRequest, httpResponse) => {
  const result = await add_option_contract_save_order(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

optionContractSaveOrderRouter.delete("/remove_option_contract_save_order", async (httpRequest, httpResponse) => {
  const result = await remove_option_contract_save_order(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

module.exports = optionContractSaveOrderRouter;