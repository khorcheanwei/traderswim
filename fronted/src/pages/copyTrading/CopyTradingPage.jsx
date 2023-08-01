import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import TradingStockAllActivePlaceOrder from '../tradingStock/TradingStockAllActivePlaceOrder';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import CopyTradingOrderPage from '../copyTradingOrder/CopyTradingOrderPage.jsx'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'
import OptionPlaceOrderPanelPage from '../optionPlaceOrderPanel/OptionPlaceOrderPanelPage';
import { Button, PageButton } from './../shared/Button';
import Overlay from "./../Overlay";

export default function CopyTradingPage() {

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
          let copyTradingMainAccountDataSet = new Set();

          let copyTradingMainAccountDataRow = value[0];
          let copyTradingOptionChainStatusColor = true;
          let optionChainStatusInactiveList = ["REJECTED", "CANCELED", "FILLED", "EXPIRED"];
          for (let index=0; index < value.length; index++) {
            let currentOptionChainStatus = value[index].optionChainStatus;

            copyTradingMainAccountDataSet.add(currentOptionChainStatus);
            if (copyTradingOptionChainStatusColor && !optionChainStatusInactiveList.includes(currentOptionChainStatus)) {
              copyTradingOptionChainStatusColor = false;
            }
          }
          
          if (copyTradingMainAccountDataSet.size > 1) {
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

  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingOrderContext);

  const allActivePlaceOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }

 
  return (
    <div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <label className="flex gap-x-2 items-baseline">
            {/*<span className="text-gray-700">Search: </span>
            <input
              type="text"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} records...`}
            />*/}
            </label> 
          <div className="flex gap-6 h-12">
            <Button className="text-gray-700 " onClick={allActivePlaceOrderClose}>BUY/SELL</Button>
          </div>
        </div>
        <div>
          <Overlay isOpen={isOpenTradingStock} >
            <TradingStockAllActivePlaceOrder onClose={allActivePlaceOrderClose}></TradingStockAllActivePlaceOrder>
          </Overlay>
        </div>
      </div>
      <div className="h-screen">
        <div className="h-[40%] overflow-y-auto">
          <CopyTradingOrderPage />
        </div>
        <div className="h-[40%] flex">
            <div className="w-[70%] overflow-scroll">
              <CopyTradingPositionPage />
            </div> 
            <div className="w-[30%] overflow-scroll">
              <OptionPlaceOrderPanelPage/>
            </div>
        </div>
      </div>
    </div>
  );
}