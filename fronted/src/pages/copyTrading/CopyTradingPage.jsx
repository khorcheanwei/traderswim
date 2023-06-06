import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import CopyTradingTable, { SettingsPanel } from './CopyTradingTable'

export default function CopyTradingPage() {

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'Place new order',
      accessor: 'placeNewOrder',
      Cell: SettingsPanel,
    },
    {
      Header: 'Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    },
    {
      Header: 'Time',
      accessor: 'optionChainEnteredTime',
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'optionChainInstruction',
    },
    {
      Header: 'Qty',
      accessor: 'optionChainQuantity',
    },
    {
      Header: 'Filled Qty',
      accessor: 'optionChainFilledQuantity',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Price',
      accessor: 'optionChainPrice',
    },
    {
      Header: 'Order type',
      accessor: 'optionChainOrderType',
    },
    {
      Header: 'Status',
      accessor: 'optionChainStatus',
    }
  ], [])

  const [copyTradingAccountData, setCopyTradingAccountData] = useState([]);
  const { isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful } = useContext(CopyTradingAccountContext);

  async function fetchCopyTradingAccountData() {
    try {
      const response = await axios.get('/copy_trading_account/database')
      if (response.data != null && response.data.length != 0) {
        setCopyTradingAccountData(response.data)
      }

    } catch (error) {
      console.log(error.message);
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
    <div>
      <div className='min-h-screen bg-gray-100 text-black'>
        <main className='mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
          <div className='mt-6'>
            <CopyTradingTable columns={columns} data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}