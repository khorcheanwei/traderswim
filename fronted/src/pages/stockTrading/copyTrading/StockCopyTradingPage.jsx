import axios from 'axios';
import React from 'react'
import { useContext, useEffect, useRef  } from 'react';

import { StockCopyTradingOrderContext } from './../context/StockCopyTradingOrderContext';
import { StockCopyTradingPositionContext } from './../context/StockCopyTradingPositionContext';
import StockCopyTradingOrderPage from './../copyTradingOrder/StockCopyTradingOrderPage.jsx'
import StockCopyTradingPositionPage from '../copyTradingPosition/StockCopyTradingPositionPage';

export default function StockCopyTradingPage({children}) {
  const {stockCopyTradingOrderDataDict, setStockCopyTradingOrderDataDict, stockCopyTradingOrderMainData, setStockCopyTradingOrderMainData} = useContext(StockCopyTradingOrderContext);
  const {copyTradingPositionDataDict, setCopyTradingPositionDataDict,copyTradingPositionMainData, setCopyTradingPositionMainData} = useContext(StockCopyTradingPositionContext);
  
  async function fetchStockCopyTradingData() {
    try {
      // get order information
      let response = await axios.get('/stock_copy_trading/database');
      const copyTradingAccountDataDictResponse = response.data;
      setStockCopyTradingOrderDataDict(copyTradingAccountDataDictResponse);

      if (copyTradingAccountDataDictResponse != null && copyTradingAccountDataDictResponse.length != 0) {

        let copyTradingMainAccountDataList = [];
        for (const [key, value] of Object.entries(copyTradingAccountDataDictResponse).reverse()) {
          let stockStatusSet = new Set();
          let stockFilledQuantitySet = new Set();

          let copyTradingMainAccountDataRow = value[0];
          let copyTradingStockStatusColor = true;
          let stockStatusInactiveList = ["REJECTED", "CANCELED", "FILLED", "EXPIRED"];
          for (let index=0; index < value.length; index++) {
            let currentStockStatus = value[index]["stockStatus"];
            let currentStockFilledQuantity = value[index]["stockFilledQuantity"];

            stockStatusSet.add(currentStockStatus);
            stockFilledQuantitySet.add(currentStockFilledQuantity);

            if (copyTradingStockStatusColor && !stockStatusInactiveList.includes(currentStockStatus)) {
              copyTradingStockStatusColor = false;
            }
          }
          
          if (stockStatusSet.size > 1 || stockFilledQuantitySet.size > 1) {
            copyTradingMainAccountDataRow["stockStatusColor"] = "purple"
          } else {
            if (copyTradingStockStatusColor) {
              copyTradingMainAccountDataRow["stockStatusColor"] = "green";  
            } else {
              copyTradingMainAccountDataRow["stockStatusColor"] = "red";
            }
            
          }
          copyTradingMainAccountDataList.push(copyTradingMainAccountDataRow);
        }
        setStockCopyTradingOrderMainData(copyTradingMainAccountDataList)
      }

      /*
      // get position information
      response = await axios.get('/copy_trading_position_account/database');
      const copyTradingPositionDataDictResponse = response.data;
      setCopyTradingPositionDataDict(copyTradingPositionDataDictResponse);

      if (copyTradingPositionDataDictResponse != null && copyTradingPositionDataDictResponse.length != 0) {

        let copyTradingMainPositionAccountDataList = [];
        for (const [key, value] of Object.entries(copyTradingPositionDataDictResponse)) {
          copyTradingMainPositionAccountDataList.push(value[0]);
        }
        setCopyTradingPositionMainData(copyTradingMainPositionAccountDataList)
      } */

    } catch (error) {
      console.log(error.message);
    }
  }

  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(fetchStockCopyTradingData, 1 * 500);
    return () => {
      if(ref.current){
        clearInterval(ref.current);
      }
    }
  }, [])

  return (
    <div className="h-screen">
      <div className="h-[40%] overflow-y-auto">
        <StockCopyTradingOrderPage />
      </div>
      <div className="h-[40%] flex">
          <div className="w-[50%] overflow-scroll">
            <StockCopyTradingPositionPage />
          </div> 
          <div className="w-[50%]">
            {children}
          </div>
      </div>
    </div>
  );
}