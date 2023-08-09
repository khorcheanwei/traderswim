const { optionContractSaveOrderDBOperation } = require("../../data-access/index.js");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

// To get option contract save order list
async function get_option_contract_save_order_list(httpRequest) {
  const { token } = httpRequest.cookies;

  let option_contract_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let dbQueryResult = await optionContractSaveOrderDBOperation.getOptionContractSaveOrderList(agentID);
      for(let index = 0; index < dbQueryResult.length; index++){
        option_contract_save_order_list.push(dbQueryResult[index]["optionChainSymbol"]);
      }
      
      return { success: true, data: option_contract_save_order_list };
    } catch (error) {
      return { success: false, data: option_contract_save_order_list };
    }
  } else {
    return { success: true, data: option_contract_save_order_list };
  }
}

// To add option contract save order
async function add_option_contract_save_order(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      await optionContractSaveOrderDBOperation.addOptionContractSaveOrder(agentID, optionChainSymbol);
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  } else {
    return { success: true };
  }
}

// To remove option contract save order
async function remove_option_contract_save_order(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      await optionContractSaveOrderDBOperation.removeOptionContractSaveOrder(agentID, optionChainSymbol);
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  } else {
    return { success: true };
  }
}

module.exports = {
    get_option_contract_save_order_list,
    add_option_contract_save_order,
    remove_option_contract_save_order
};
