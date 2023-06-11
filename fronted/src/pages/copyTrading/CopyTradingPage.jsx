import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import CopyTradingOrderPage from '../copyTradingAllAccountOrder/CopyTradingOrderPage.jsx'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'

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
        for (const [key, value] of Object.entries(copyTradingAccountDataDictResponse)) {
          copyTradingMainAccountDataList.push(value[0]);
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
    ref.current = setInterval(fetchCopyTradingAccountData, 1 * 1000);
    return () => {
      if(ref.current){
        clearInterval(ref.current);
      }
    }
  }, [])

 
  return (
    <div>
      <CopyTradingOrderPage />
      <CopyTradingPositionPage/>
      
    </div>
  );
}