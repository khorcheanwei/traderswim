import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import CopyTradingOrderPage from '../copyTradingAllAccountOrder/CopyTradingOrderPage.jsx'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'

export default function CopyTradingPage() {

  const {copyTradingAccountDataDict, setCopyTradingAccountDataDict, copyTradingMainAccountData, setCopyTradingMainAccountData} = useContext(CopyTradingAccountContext);
  
  async function fetchCopyTradingAccountData() {
    try {
      const response = await axios.get('/copy_trading_account/database');
      const copyTradingAccountDataDictResponse = response.data;
      setCopyTradingAccountDataDict(copyTradingAccountDataDictResponse);

      if (copyTradingAccountDataDictResponse != null && copyTradingAccountDataDictResponse.length != 0) {

        let copyTradingAccountDataList = [];
        for (const [key, value] of Object.entries(copyTradingAccountDataDictResponse)) {
          copyTradingAccountDataList.push(value[0]);
        }
        setCopyTradingMainAccountData(copyTradingAccountDataList)
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