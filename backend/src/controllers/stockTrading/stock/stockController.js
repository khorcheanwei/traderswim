const { stockDBOperation } = require("../../../data-access/index.js");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

function obtain_stock_list(queryResult) {
  let stock_list = []
  for(let index = 0; index < queryResult.length; index++){
    stock_list.push(queryResult[index]["stockSymbol"]);
  }
  return stock_list;
}


// To get stock list
async function get_stock_list(httpRequest) {
  const { token } = httpRequest.cookies;

  let stock_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await stockDBOperation.getStockList(agentID);
      stock_list = obtain_stock_list(queryResult);
  
      return { success: true, list: stock_list };
    } catch (error) {
      return { success: false, list: stock_list };
    }
  } else {
    return { success: true, list: stock_list };
  }
}

// To add stock
async function add_stock(httpRequest) {
  const { token } = httpRequest.cookies;
  const { stockSymbol } = httpRequest.body;

  let stock_list = [];
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await stockDBOperation.addStock(agentID, stockSymbol);
      stock_list = obtain_stock_list(queryResult);
      
      return { success: true, list: stock_list };
    } catch (error) {
      return { success: false, list: stock_list };
    }
  } else {
    return { success: true, list: stock_list };
  }
}

// To remove stock
async function remove_stock(httpRequest) {
  const { token } = httpRequest.cookies;
  const { stockSymbol } = httpRequest.body;

  let stock_list = [];
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await stockDBOperation.removeStock(agentID, stockSymbol);
      stock_list = obtain_stock_list(queryResult);
      
      return { success: true, list: stock_list };
    } catch (error) {
      return { success: false, list: stock_list };
    }
  } else {
    return { success: true, list: stock_list };
  }
}

module.exports = {
    get_stock_list,
    add_stock,
    remove_stock
};