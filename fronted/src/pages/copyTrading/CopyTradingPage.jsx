import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';

import CopyTradingTable, { SettingsPanel } from './CopyTradingTable'

export default function CopyTradingPage() {

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: SettingsPanel,
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Remaining Qty',
      accessor: 'optionChainRemainingQuantity',
    },
    {
      Header: 'Price',
      accessor: 'optionChainPrice',
    },
    {
      Header: 'Qty',
      accessor: 'optionChainQuantity',
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'optionChainInstruction',
    },
    {
      Header: 'Status',
      accessor: 'optionChainStatus',
    },
    {
      Header: 'Order type',
      accessor: 'optionChainOrderType',
    },
    {
      Header: 'Time',
      accessor: 'optionChainEnteredTime',
    },
    {
      Header: 'Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    },
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