const { optionContractDBOperation } = require("../../data-access/index.js");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

function obtain_option_contract_list(queryResult) {
  let option_contract_list = []
  for(let index = 0; index < queryResult.length; index++){
    option_contract_list.push(queryResult[index]["optionChainSymbol"]);
  }
  return option_contract_list;
}


// To get option contract list
async function get_option_contract_list(httpRequest) {
  const { token } = httpRequest.cookies;

  let option_contract_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await optionContractDBOperation.getOptionContractList(agentID);
      option_contract_list = obtain_option_contract_list(queryResult);
  
      return { success: true, list: option_contract_list };
    } catch (error) {
      return { success: false, list: option_contract_list };
    }
  } else {
    return { success: true, list: option_contract_list };
  }
}

// To add option contract
async function add_option_contract(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  let option_contract_list = [];
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await optionContractDBOperation.addOptionContract(agentID, optionChainSymbol);
      option_contract_list = obtain_option_contract_list(queryResult);
      
      return { success: true, list: option_contract_list };
    } catch (error) {
      return { success: false, list: option_contract_list };
    }
  } else {
    return { success: true, list: option_contract_list };
  }
}

// To remove option contract
async function remove_option_contract(httpRequest) {
  const { token } = httpRequest.cookies;
  const { optionChainSymbol } = httpRequest.body;

  let option_contract_list = [];
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await optionContractDBOperation.removeOptionContract(agentID, optionChainSymbol);
      option_contract_list = obtain_option_contract_list(queryResult);
      
      return { success: true, list: option_contract_list };
    } catch (error) {
      return { success: false, list: option_contract_list };
    }
  } else {
    return { success: true, list: option_contract_list };
  }
}

module.exports = {
    get_option_contract_list,
    add_option_contract,
    remove_option_contract
};
