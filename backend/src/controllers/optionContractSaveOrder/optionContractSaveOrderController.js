const { optionContractSaveOrderDBOperation } = require("../../data-access/index.js");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

function obtain_option_contract_save_order_list(queryResult) {
  let option_contract_save_order_list = []
  for(let index = 0; index < queryResult.length; index++){
    let option_contract_save_order = {
      "optionChainSymbol": queryResult[index]["optionChainSymbol"],
      "optionChainDescription": queryResult[index]["optionChainDescription"],
      "optionChainOrderType": queryResult[index]["optionChainOrderType"],
      "optionChainInstruction": queryResult[index]["optionChainInstruction"],
      "optionChainPrice": queryResult[index]["optionChainPrice"],
      "optionChainQuantity": queryResult[index]["optionChainQuantity"]
    }
    option_contract_save_order_list.push(option_contract_save_order);
  }
  return option_contract_save_order_list;
}


// To get option contract save order list
async function get_option_contract_save_order_list(httpRequest) {
  const { token } = httpRequest.cookies;

  let option_contract_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await optionContractSaveOrderDBOperation.getOptionContractSaveOrderList(agentID);
      option_contract_save_order_list = obtain_option_contract_save_order_list(queryResult);
      
      return { success: true, list: option_contract_save_order_list };
    } catch (error) {
      return { success: false, list: option_contract_save_order_list };
    }
  } else {
    return { success: true, list: option_contract_save_order_list };
  }
}

// To add option contract save order
async function add_option_contract_save_order(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol, optionChainDescription, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice } = httpRequest.body;

  let option_contract_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      const queryResult = await optionContractSaveOrderDBOperation.addOptionContractSaveOrder(agentID, optionChainSymbol, optionChainDescription, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice);
      option_contract_save_order_list = obtain_option_contract_save_order_list(queryResult);

      return { success: true, list: option_contract_save_order_list };
    } catch (error) {
      return { success: false, list: option_contract_save_order_list };
    }
  } else {
    return { success: true, list: option_contract_save_order_list };
  }
}

// To remove option contract save order
async function remove_option_contract_save_order(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  let option_contract_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await optionContractSaveOrderDBOperation.removeOptionContractSaveOrder(agentID, optionChainSymbol);
      option_contract_save_order_list = obtain_option_contract_save_order_list(queryResult);
      
      return { success: true, list: option_contract_save_order_list };
    } catch (error) {
      return { success: false, list: option_contract_save_order_list };
    }
  } else {
    return { success: true, list: option_contract_save_order_list };
  }
}

module.exports = {
    get_option_contract_save_order_list,
    add_option_contract_save_order,
    remove_option_contract_save_order
};
