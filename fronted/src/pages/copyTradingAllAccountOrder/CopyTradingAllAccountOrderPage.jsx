import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import CopyTradingAllAccountOrderTable from './CopyTradingAllAccountOrderTable'

export default function CopyTradingAllAccountOrderPage({ onClose }) {

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
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
  
  async function fetchCopyTradingAccountData() {
    try {
      const response = await axios.get('/copy_trading_account/database')
      if (response.data != null && response.data.length != 0) {
        setCopyTradingAccountData(response.data)
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

  var data = React.useMemo(() => copyTradingAccountData, [copyTradingAccountData])

  return (
    <div>
      <div className='min-h-screen bg-gray-100 text-black'>
        <main className='mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
          <div className='mt-6'>
          <div className="flex justify-end gap-5">
                <button
                    type="button"
                    className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={onClose}>
                    CANCEL
                </button>
            </div>
            <CopyTradingAllAccountOrderTable columns={columns} data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}