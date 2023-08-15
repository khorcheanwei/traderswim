import axios from 'axios';
import React from 'react'
import { useContext, useEffect, useRef  } from 'react';

import { CopyTradingOrderContext } from './../context/CopyTradingOrderContext';
import { CopyTradingPositionContext } from './../context/CopyTradingPositionContext';
import CopyTradingOrderPage from './../copyTradingOrder/CopyTradingOrderPage.jsx'
import CopyTradingPositionPage from './../copyTradingPosition/CopyTradingPositionPage';

export default function CopyTradingPage({children}) {
  const {copyTradingOrderDataDict, setCopyTradingOrderDataDict, copyTradingOrderMainData, setCopyTradingOrderMainData} = useContext(CopyTradingOrderContext);
  const {copyTradingPositionDataDict, setCopyTradingPositionDataDict,copyTradingPositionMainData, setCopyTradingPositionMainData} = useContext(CopyTradingPositionContext);
  
  async function fetchCopyTradingAccountData() {
    try {
      // get order information
      let response = await axios.get('/copy_trading_account/database');
      const copyTradingAccountDataDictResponse = response.data;
      setCopyTradingOrderDataDict(copyTradingAccountDataDictResponse);

      if (copyTradingAccountDataDictResponse != null && copyTradingAccountDataDictResponse.length != 0) {

        let copyTradingMainAccountDataList = [];
        for (const [key, value] of Object.entries(copyTradingAccountDataDictResponse).reverse()) {
          let optionChainStatusSet = new Set();
          let optionChainFilledQuantitySet = new Set();

          let copyTradingMainAccountDataRow = value[0];
          let copyTradingOptionChainStatusColor = true;
          let optionChainStatusInactiveList = ["REJECTED", "CANCELED", "FILLED", "EXPIRED"];
          for (let index=0; index < value.length; index++) {
            let currentOptionChainStatus = value[index]["optionChainStatus"];
            let currentOptionChainFilledQuantity = value[index]["optionChainFilledQuantity"];

            optionChainStatusSet.add(currentOptionChainStatus);
            optionChainFilledQuantitySet.add(currentOptionChainFilledQuantity);

            if (copyTradingOptionChainStatusColor && !optionChainStatusInactiveList.includes(currentOptionChainStatus)) {
              copyTradingOptionChainStatusColor = false;
            }
          }
          
          if (optionChainStatusSet.size > 1 || optionChainFilledQuantitySet.size > 1) {
            copyTradingMainAccountDataRow["optionChainStatusColor"] = "purple"
          } else {
            if (copyTradingOptionChainStatusColor) {
              copyTradingMainAccountDataRow["optionChainStatusColor"] = "green";  
            } else {
              copyTradingMainAccountDataRow["optionChainStatusColor"] = "red";
            }
            
          }
          copyTradingMainAccountDataList.push(copyTradingMainAccountDataRow);
        }
        setCopyTradingOrderMainData(copyTradingMainAccountDataList)
      }

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
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(fetchCopyTradingAccountData, 1 * 500);
    return () => {
      if(ref.current){
        clearInterval(ref.current);
      }
    }
  }, [])

  return (
    <div className="h-screen">
      <div className="h-[40%] overflow-y-auto">
        <CopyTradingOrderPage />
      </div>
      <div className="h-[40%] flex">
          <div className="w-[40%] overflow-scroll">
            <CopyTradingPositionPage />
          </div> 
          <div className="w-[60%]">
            {children}
          </div>
      </div>
    </div>
  );
}