import axios from "axios";
import React from "react";
import { useContext, useEffect, useRef } from "react";

import { StockCopyTradingOrderContext } from "./../context/StockCopyTradingOrderContext";
import { StockCopyTradingPositionContext } from "./../context/StockCopyTradingPositionContext";
import StockCopyTradingOrderPage from "./../copyTradingOrder/StockCopyTradingOrderPage.jsx";
import StockCopyTradingPositionPage from "../copyTradingPosition/StockCopyTradingPositionPage";

export default function StockCopyTradingPage({ children }) {
  const {
    stockCopyTradingOrderDataDict,
    setStockCopyTradingOrderDataDict,
    stockCopyTradingOrderMainData,
    setStockCopyTradingOrderMainData,
  } = useContext(StockCopyTradingOrderContext);
  const {
    stockCopyTradingPositionDataDict,
    setStockCopyTradingPositionDataDict,
    stockCopyTradingPositionMainData,
    setStockCopyTradingPositionMainData,
  } = useContext(StockCopyTradingPositionContext);

  async function fetchStockCopyTradingData() {
    try {
      // get order information
      let response = await axios.get("/stock_copy_trading/database");
      const stockCopyTradingDataDictResponse = response.data;
      setStockCopyTradingOrderDataDict(stockCopyTradingDataDictResponse);

      if (
        stockCopyTradingDataDictResponse != null &&
        stockCopyTradingDataDictResponse.length != 0
      ) {
        let stockCopyTradingMainAccountDataList = [];
        for (const [key, value] of Object.entries(
          stockCopyTradingDataDictResponse,
        ).reverse()) {
          let stockStatusSet = new Set();
          let stockFilledQuantitySet = new Set();

          let stockCopyTradingMainAccountDataRow = value[0];
          let stockCopyTradingStockStatusColor = true;
          let stockStatusInactiveList = [
            "REJECTED",
            "CANCELED",
            "FILLED",
            "EXPIRED",
          ];
          for (let index = 0; index < value.length; index++) {
            let currentStockStatus = value[index]["stockStatus"];
            let currentStockFilledQuantity =
              value[index]["stockFilledQuantity"];

            stockStatusSet.add(currentStockStatus);
            stockFilledQuantitySet.add(currentStockFilledQuantity);

            if (
              stockCopyTradingStockStatusColor &&
              !stockStatusInactiveList.includes(currentStockStatus)
            ) {
              stockCopyTradingStockStatusColor = false;
            }
          }

          if (stockStatusSet.size > 1 || stockFilledQuantitySet.size > 1) {
            stockCopyTradingMainAccountDataRow["stockStatusColor"] = "purple";
          } else {
            if (stockCopyTradingStockStatusColor) {
              stockCopyTradingMainAccountDataRow["stockStatusColor"] = "green";
            } else {
              stockCopyTradingMainAccountDataRow["stockStatusColor"] = "red";
            }
          }
          stockCopyTradingMainAccountDataList.push(
            stockCopyTradingMainAccountDataRow,
          );
        }
        setStockCopyTradingOrderMainData(stockCopyTradingMainAccountDataList);
      }

      // get position information
      response = await axios.get("/stock_copy_trading_position/database");

      const stockCopyTradingPositionDataDictResponse = response.data;
      setStockCopyTradingPositionDataDict(
        stockCopyTradingPositionDataDictResponse,
      );

      if (
        stockCopyTradingPositionDataDictResponse != null &&
        stockCopyTradingPositionDataDictResponse.length != 0
      ) {
        let stockCopyTradingMainPositionAccountDataList = [];
        for (const [key, value] of Object.entries(
          stockCopyTradingPositionDataDictResponse,
        )) {
          stockCopyTradingMainPositionAccountDataList.push(value[0]);
        }
        setStockCopyTradingPositionMainData(
          stockCopyTradingMainPositionAccountDataList,
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const ref = useRef(null);
  useEffect(() => {
    ref.current = setInterval(fetchStockCopyTradingData, 1 * 500);
    return () => {
      if (ref.current) {
        clearInterval(ref.current);
      }
    };
  }, []);

  return (
    <div className="h-screen">
      <div className="h-[40%] overflow-y-auto">
        <StockCopyTradingOrderPage />
      </div>
      <div className="h-[40%] flex">
        <div className="w-[50%] overflow-scroll">
          <StockCopyTradingPositionPage />
        </div>
        <div className="w-[50%]">{children}</div>
      </div>
    </div>
  );
}
