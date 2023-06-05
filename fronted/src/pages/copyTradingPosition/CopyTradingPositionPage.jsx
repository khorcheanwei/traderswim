import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import CopyTradingPositionTable from './CopyTradingPositionTable'

export default function CopyTradingPositionPage() {

  const columns = React.useMemo(() => [
    {
      Header: 'Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    },
    {
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Average price',
      accessor: 'optionChainAveragePrice',
    },
    {
      Header: 'Long Qty',
      accessor: 'optionChainLongQuantity',
    },
    {
      Header: 'Settled Long Qty',
      accessor: 'optionChainSettledLongQuantity',
    },
    {
      Header: 'Short Qty',
      accessor: 'optionChainShortQuantity',
    },
    {
      Header: 'Settled Short Qty',
      accessor: 'optionChainSettledShortQuantity',
    }
  ], [])

  const [copyTradingPositionAccountData, setCopyTradingPositionAccountData] = useState([]);

  
  async function fetchCopyTradingPositionAccountData() {
    try {
      const response = await axios.get('/copy_trading_position_account/database')
      if (response.data != null && response.data.length != 0) {
        setCopyTradingPositionAccountData(response.data)
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchCopyTradingPositionAccountData();
  }, [])


  var data = React.useMemo(() => copyTradingPositionAccountData, [copyTradingPositionAccountData])

  return (
    <div>
      <div className='min-h-screen bg-gray-100 text-black'>
        <main className='mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
          <div className='mt-6'>
            <CopyTradingPositionTable columns={columns} data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}