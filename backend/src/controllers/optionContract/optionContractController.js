const { optionContractDBOperation } = require("../../data-access/index.js");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

// To get option contract list
async function get_option_contract_list(httpRequest) {
  const { token } = httpRequest.cookies;

  let option_contract_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let dbQueryResult = await optionContractDBOperation.getOptionContractList(agentID);
      for(let index = 0; index < dbQueryResult.length; index++){
        option_contract_list.push(dbQueryResult[index]["optionChainSymbol"]);
      }
      
      return { success: true, data: option_contract_list };
    } catch (error) {
      return { success: false, data: option_contract_list };
    }
  } else {
    return { success: true, data: option_contract_list };
  }
}

// To add option contract
async function add_option_contract(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      await optionContractDBOperation.addOptionContract(agentID, optionChainSymbol);
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  } else {
    return { success: true };
  }
}

// To remove option contract
async function remove_option_contract(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      await optionContractDBOperation.removeOptionContract(agentID, optionChainSymbol);
      
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  } else {
    return { success: true };
  }
}

module.exports = {
    get_option_contract_list,
    add_option_contract,
    remove_option_contract
};
