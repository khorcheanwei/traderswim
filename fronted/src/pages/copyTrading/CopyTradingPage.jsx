import axios from 'axios';
import React from 'react'
import {useContext, useState, useEffect} from 'react';
import { async } from 'regenerator-runtime';
import { AccountContext } from './../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';

import CopyTradingTable, { SelectColumnFilter, StatusPill, SettingsPanel, ConnectionToggle } from './CopyTradingTable' 

export default function CopyTradingPage()  {

  const columns = React.useMemo(() => [
    {
      Header: "Account Name",
      accessor: 'accountName',
    },
    {
      Header: " Stock pair",
      accessor: 'stockPair',
    },
    {
      Header: "Leverage",
      accessor: 'leverage',
    },
    {
      Header: "Entry price",
      accessor: 'entryPrice',
    },
    {
      Header: "Order Quantity",
      accessor: 'orderQuantity',
    },
    {
      Header: "Filled Quantity",
      accessor: 'filledQuantity',
    },
    {
      Header: "Order date",
      accessor: 'orderDate',
    }, 
    {
        Header: "Place new order",
        accessor: 'placeNewOrder',
        Cell: SettingsPanel,
    }, 
  ], [])


  const {copyTradingAccountData, setCopyTradingAccountData, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful} = useContext(CopyTradingAccountContext);

  async function fetchCopyTradingAccountData() {
      try {
        const response = await axios.get("/copy_trading_account/database")
        if (response.data != null) {
          setCopyTradingAccountData(response.data)
        }
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      fetchCopyTradingAccountData();
    }, []) 

    if (isCopyTradingAccountSuccessful) {
      fetchCopyTradingAccountData();
    }
    
    var data = React.useMemo(() => copyTradingAccountData, [copyTradingAccountData])

    return (
      <div className="min-h-screen bg-gray-100 text-black">
        <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="mt-6">
            <CopyTradingTable columns={columns} data={data} />
          </div>
        </main>
      </div>
    );
}