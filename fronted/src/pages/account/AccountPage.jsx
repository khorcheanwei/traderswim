import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';
import { AccountContext } from '../context/AccountContext';
import io from 'socket.io-client';

import AccountsTable, { SettingsPanel, TradingActiveToggle, ConnectionPanel } from './AccountTable'  // new

export default function AccountsPage() {

  const socket = io('http://localhost:3000');

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
      Header: 'Balance',
      accessor: 'accountBalance',
    },
    {
      Header: 'Connection',
      accessor: 'accountConnection',
      Cell: ConnectionPanel,
    },
    {
      Header: 'Connection time (minutes)',
      accessor: 'accountConnectionTime',
    },
    {
      Header: "Trading Active",
      accessor: 'accountTradingActive',
      Cell: TradingActiveToggle,
    },
    {
      Header: 'Settings',
      accessor: 'name',
      Cell: SettingsPanel,
    },
  ], [])

  const { accountTableData, setAccountTableData } = useContext(AccountContext);

  async function fetchAccountData() {
    try {

      const response = await axios.get('/trading_account/database');
      if (response.data != null) {
        setAccountTableData(response.data)
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(fetchAccountData, 1 * 500);
    return () => {
      if(ref.current){
        clearInterval(ref.current);
      }
    }
  }, [])

  var data = React.useMemo(() => accountTableData, [accountTableData])

  return (
    <div className='min-h-screen bg-gray-100 text-black'>
      <main className='mx-auto px-4 sm:px-6 lg:px-8 pt-4'>
        <div className='mt-6'>
          <AccountsTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}