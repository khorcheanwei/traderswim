const express = require("express");

const optionContractRouter = express.Router();

const {
    get_option_contract_list,
    add_option_contract,
    remove_option_contract
} = require("../controllers/optionContract/optionContractController.js");


optionContractRouter.get("/get_option_contract_list", async (httpRequest, httpResponse) => {
  const result = await get_option_contract_list(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

optionContractRouter.post("/add_option_contract", async (httpRequest, httpResponse) => {
  const result = await add_option_contract(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

optionContractRouter.delete("/remove_option_contract", async (httpRequest, httpResponse) => {
  const result = await remove_option_contract(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result);
  } else {
    httpResponse.status(400).json(result);
  }
});

module.exports = optionContractRouter;