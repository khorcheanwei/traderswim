const { stockSaveOrderDBOperation } = require("../../../data-access/index.js");
const { prepare_make_order } = require("./../stockCopyTradingController");

const jwt = require("jsonwebtoken");
const jwtSecret = "traderswim";

function obtain_stock_save_order_list(queryResult) {
  let stock_save_order_list = []
  for(let index = 0; index < queryResult.length; index++){
    let stock_save_order = {
      "stockSymbol": queryResult[index]["stockSymbol"],
      "stockOrderType": queryResult[index]["stockOrderType"],
      "stockInstruction": queryResult[index]["stockInstruction"],
      "stockPrice": queryResult[index]["stockPrice"],
      "stockQuantity": queryResult[index]["stockQuantity"]
    }
    stock_save_order_list.push(stock_save_order);
  }
  return stock_save_order_list;
}


// To get stock save order list
async function get_stock_save_order_list(httpRequest) {
  const { token } = httpRequest.cookies;

  let stock_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await stockSaveOrderDBOperation.getStockSaveOrderList(agentID);
      stock_save_order_list = obtain_stock_save_order_list(queryResult);
      
      return { success: true, list: stock_save_order_list };
    } catch (error) {
      return { success: false, list: stock_save_order_list };
    }
  } else {
    return { success: true, list: stock_save_order_list };
  }
}

// To add stock save order
async function add_stock_save_order(httpRequest) {
  const { token } = httpRequest.cookies;
  let { stockSymbol, stockSession, stockDuration, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity } = httpRequest.body;

  let stock_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      ({ stockSymbol, stockSession, stockDuration, stockInstruction, stockOrderType, stockQuantity, stockPrice, stockStopPrice, stockStopPriceLinkType, 
      stockStopPriceOffset} = prepare_make_order(stockSymbol, stockSession, stockDuration, stockInstruction, stockOrderType, stockQuantity, 
        stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset));
      
      const queryResult = await stockSaveOrderDBOperation.addStockSaveOrder(agentID, stockSymbol, stockSession, stockDuration, stockOrderType, stockInstruction, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity);
      stock_save_order_list = obtain_stock_save_order_list(queryResult);

      return { success: true, list: stock_save_order_list };
    } catch (error) {
      return { success: false, list: stock_save_order_list };
    }
  } else {
    return { success: true, list: stock_save_order_list };
  }
}

// To remove stock save order
async function remove_stock_save_order(httpRequest) {
  const { token } = httpRequest.cookies;
  const { stockSymbol } = httpRequest.body;

  let stock_save_order_list = []
  if (token) {
    try {
      let agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;
      
      let queryResult = await stockSaveOrderDBOperation.removeStockSaveOrder(agentID, stockSymbol);
      stock_save_order_list = obtain_stock_save_order_list(queryResult);
      
      return { success: true, list: stock_save_order_list };
    } catch (error) {
      return { success: false, list: stock_save_order_list };
    }
  } else {
    return { success: true, list: stock_save_order_list };
  }
}

module.exports = {
    get_stock_save_order_list,
    add_stock_save_order,
    remove_stock_save_order
};