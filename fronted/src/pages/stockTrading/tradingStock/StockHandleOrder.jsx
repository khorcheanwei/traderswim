import axios from "axios";
import { useState, useEffect } from "react";

export function get_duration_and_session(stockSessionDuration) {
  if (stockSessionDuration == "DAY") {
    return { stockSession: "NORMAL", stockDuration: "DAY" };
  } else if (stockSessionDuration == "GTC") {
    return { stockSession: "NORMAL", stockDuration: "GOOD_TILL_CANCEL" };
  } else if (stockSessionDuration == "EXT") {
    return { stockSession: "SEAMLESS", stockDuration: "DAY" };
  } else if (stockSessionDuration == "GTC_EXT") {
    return { stockSession: "SEAMLESS", stockDuration: "GOOD_TILL_CANCEL" };
  } else {
    return { stockSession: null, stockDuration: null };
  }
}

export function get_duration_and_session_reverse(session, duration) {
  if (session == "NORMAL" && duration == "DAY") {
    return "DAY";
  } else if (session == "NORMAL" && duration == "GOOD_TILL_CANCEL") {
    return "GTC";
  } else if (session == "SEAMLESS" && duration == "DAY") {
    return "EXT";
  } else if (session == "SEAMLESS" && duration == "GOOD_TILL_CANCEL") {
    return "GTC_EXT";
  } else {
    return null;
  }
}

export async function getStockQuotes(
  setIsLoading,
  stockSymbol,
  setStockPrice,
  setStockStopPrice,
) {
  try {
    setIsLoading(true);
    setStockPrice(0);
    const { data } = await axios.get("/stock_copy_trading/get_stock_quotes/", {
      params: { stockSymbol },
      timeout: 5000,
    });
    if (data != null) {
      // set first stock data when user get new stock quotes
      const stockBidPrice = data[stockSymbol]["bidPrice"];
      setStockPrice(stockBidPrice);
      setStockStopPrice(stockBidPrice);
    } else {
      setIsLoading(false);
      alert("Failed to get stock");
    }
    setIsLoading(false);
  } catch (error) {
    console.log(error.message);
    setIsLoading(false);
    alert("Failed to get stock");
  }
}

export default function StockHandleOrder({
  isLoading,
  setIsLoading,
  stockSymbol,
  setStockSymbol,
  stockInstruction,
  setStockInstruction,
  stockSessionDuration,
  setStockSessionDuration,
  stockOrderType,
  setStockOrderType,
  stockQuantity,
  setStockQuantity,
  stockPrice,
  setStockPrice,
  stockStopPrice,
  setStockStopPrice,
  stockStopPriceLinkTypeSymbol,
  setStockStopPriceLinkTypeSymbol,
  stockStopPriceOffset,
  setStockStopPriceOffset,
}) {
  var stockInstructionList = ["BUY", "SELL"];
  var stockOrderTypeList = [
    "MARKET",
    "LIMIT",
    "STOP",
    "STOP_LIMIT",
    "TRAILING_STOP",
  ];
  var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

  var stockStopPriceLinkTypeDict = {
    "$ Dollars": "VALUE",
    "% Percent": "PERCENT",
  };

  useEffect(() => {
    if (stockStopPriceLinkTypeSymbol == "% Percent") {
      setStockStopPriceOffset(1.0);
    } else {
      setStockStopPriceOffset(0.1);
    }
  }, [stockStopPriceLinkTypeSymbol]);

  useEffect(() => {
    if (stockOrderType == "MARKET") {
      setStockPrice(0);
      setStockStopPrice(0);
      setStockStopPriceLinkTypeSymbol("$ Dollars");
      setStockStopPriceOffset(0.1);
    } else if (stockOrderType == "LIMIT") {
      setStockStopPrice(0);
      setStockStopPriceLinkTypeSymbol("$ Dollars");
      setStockStopPriceOffset(0.1);
    } else if (stockOrderType == "STOP") {
      setStockPrice(0);
      setStockStopPriceLinkTypeSymbol("$ Dollars");
      setStockStopPriceOffset(0.1);
    } else if (stockOrderType == "STOP_LIMIT") {
      setStockStopPriceLinkTypeSymbol("$ Dollars");
      setStockStopPriceOffset(0.1);
    } else {
      setStockPrice(0);
      setStockStopPrice(0);
    }
  }, [stockOrderType]);

  return (
    <div>
      <div className="relative w-full lg:max-w-sm mb-6">
        {/*<select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={event => setStockTickerName(event.target.value)}>
                    {
                        stockNameList.map((stock_name, index) => (
                            <FixedSizeList key={index}>{stock_name}</FixedSizeList>
                        ))
                    }
                </select>*/}
        <div className="grid items-end gap-6 mb-6 grid-cols-2">
          <div className="flex">
            <div>
              <input
                id="stock_pair"
                className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                type="text"
                onChange={(event) => setStockSymbol(event.target.value)}
                value={stockSymbol}
                onInput={(event) =>
                  (event.target.value = event.target.value.toUpperCase())
                }
                placeholder=" "
              />
              <label
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                htmlFor="stock_pair"
              >
                Stock Pair:
              </label>
            </div>
            <button
              type="button"
              className="inline-block rounded bg-teal-300  pt-3 pb-2.5 text-sm font-small uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              onClick={() =>
                getStockQuotes(
                  setIsLoading,
                  stockSymbol,
                  setStockPrice,
                  setStockStopPrice,
                )
              }
            >
              Search
            </button>
          </div>
          <div className="relative">
            <select
              id="stock_instruction"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={stockInstruction}
              onChange={(event) => setStockInstruction(event.target.value)}
            >
              {stockInstructionList.map((stock_instruction, index) => (
                <option key={index}>{stock_instruction}</option>
              ))}
            </select>
            <label
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
              htmlFor="stock_instruction"
            >
              Stock instruction:
            </label>
          </div>
        </div>
      </div>
      <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
        <div className="relative">
          <select
            id="stock_session_duration"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={stockSessionDuration}
            onChange={(event) => setStockSessionDuration(event.target.value)}
          >
            {stockSessionDurationList.map((stock_session_duration, index) => (
              <option key={index}>{stock_session_duration}</option>
            ))}
          </select>
          <label
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
            htmlFor="stock_session_duration"
          >
            Stock session duration:
          </label>
        </div>
        <div className="relative">
          <select
            id="stock_order_type"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            value={stockOrderType}
            onChange={(event) => setStockOrderType(event.target.value)}
          >
            {stockOrderTypeList.map((stock_order_type, index) => (
              <option key={index}>{stock_order_type}</option>
            ))}
          </select>
          <label
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
            htmlFor="stock_order_type"
          >
            Stock order type:
          </label>
        </div>
      </div>
      <div className="grid items-end gap-6 mb-6 grid-cols-2">
        <div className="relative">
          <input
            id="stock_total"
            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            type="text"
            onChange={(event) => setStockQuantity(event.target.value)}
            value={stockQuantity}
            placeholder=" "
          />
          <label
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
            htmlFor="stock_total"
          >
            Stock Total:
          </label>
        </div>
        {stockOrderType != "MARKET" &&
          stockOrderType != "TRAILING_STOP" &&
          stockOrderType != "STOP" && (
            <div className="relative">
              <input
                className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                id="stock_price"
                type="text"
                onChange={(event) => setStockPrice(event.target.value)}
                value={stockPrice}
                placeholder=" "
              />
              <label
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                htmlFor="stock_price"
              >
                Stock Price:
              </label>
            </div>
          )}
        {stockOrderType == "STOP" && (
          <div className="relative">
            <input
              id="stop_price"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              type="text"
              onChange={(event) => setStockStopPrice(event.target.value)}
              value={stockStopPrice}
              placeholder=" "
            />
            <label
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
              htmlFor="stop_price"
            >
              Stop Price:
            </label>
          </div>
        )}
      </div>
      <div className="grid items-end gap-6 mb-6 grid-cols-2">
        <div className="relative">
          {stockOrderType == "TRAILING_STOP" && (
            <div className="relative">
              <select
                id="stock_stopPriceLinkType"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                value={stockStopPriceLinkTypeSymbol}
                onChange={(event) =>
                  setStockStopPriceLinkTypeSymbol(event.target.value)
                }
              >
                {Object.keys(stockStopPriceLinkTypeDict).map(
                  (stopPriceLinkType_key, index) => (
                    <option key={index}>{stopPriceLinkType_key}</option>
                  ),
                )}
              </select>
              <label
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                htmlFor="stock_stopPriceLinkType"
              >
                Stop Price Link Type:
              </label>
            </div>
          )}
        </div>
        {stockOrderType == "STOP_LIMIT" && (
          <div className="relative">
            <input
              id="stop_price"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              type="text"
              onChange={(event) => setStockStopPrice(event.target.value)}
              value={stockStopPrice}
              placeholder=" "
            />
            <label
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
              htmlFor="stop_price"
            >
              Activation Price:
            </label>
          </div>
        )}
        {stockOrderType == "TRAILING_STOP" && (
          <div className="relative">
            <input
              id="stop_price_offset"
              className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              type="text"
              onChange={(event) => setStockStopPriceOffset(event.target.value)}
              value={stockStopPriceOffset}
              placeholder=" "
            />
            <label
              className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
              htmlFor="stop_price_offset"
            >
              Stop Price Offset:
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
