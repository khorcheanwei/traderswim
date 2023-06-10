import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import CopyTradingOrderPage from '../copyTradingAllAccountOrder/CopyTradingOrderPage.jsx'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'

export default function CopyTradingPage() {

  const {copyTradingAccountDataDict, setCopyTradingAccountDataDict, copyTradingMainAccountData, setCopyTradingMainAccountData} = useContext(CopyTradingAccountContext);
  const {copyTradingPositionAccountDataDict, setCopyTradingPositionAccountDataDict,copyTradingPositionMainAccountData, setCopyTradingPositionMainAccountData} = useContext(CopyTradingPositionContext);
  
  async function fetchCopyTradingAccountData() {
    try {
      // get order information
      let response = await axios.get('/copy_trading_account/database');
      const copyTradingAccountDataDictResponse = response.data;
      setCopyTradingAccountDataDict(copyTradingAccountDataDictResponse);

      if (copyTradingAccountDataDictResponse != null && copyTradingAccountDataDictResponse.length != 0) {

        let copyTradingMainAccountDataList = [];
        for (const [key, value] of Object.entries(copyTradingAccountDataDictResponse)) {
          copyTradingMainAccountDataList.push(value[0]);
        }
        setCopyTradingMainAccountData(copyTradingMainAccountDataList)
      }

      // get position information
      response = await axios.get('/copy_trading_position_account/database');
      const copyTradingPositionAccountDataDictResponse = response.data;
      setCopyTradingPositionAccountDataDict(copyTradingPositionAccountDataDictResponse);

      if (copyTradingPositionAccountDataDictResponse != null && copyTradingPositionAccountDataDictResponse.length != 0) {

        let copyTradingMainPositionAccountDataList = [];
        for (const [key, value] of Object.entries(copyTradingPositionAccountDataDictResponse)) {
          copyTradingMainPositionAccountDataList.push(value[0]);
        }
        setCopyTradingPositionMainAccountData(copyTradingMainPositionAccountDataList)
      }

      await axios.get('/trading_account/database');

    } catch (error) {
      console.log(error.message);
    }
  }

  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(fetchCopyTradingAccountData, 2 * 1000);
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