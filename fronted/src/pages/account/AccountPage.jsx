import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { AccountContext } from '../context/AccountContext';

import AccountsTable, { SettingsPanel } from './AccountTable'  // new

export default function AccountsPage() {

  const columns = React.useMemo(() => [
    {
      Header: "Name",
      accessor: 'accountName',
    },
    {
      Header: "Account Username",
      accessor: 'accountUsername',
    },
    {
      Header: "Balance",
      accessor: 'accountBalance',
    },
    {
      Header: "Settings",
      accessor: 'name',
      Cell: SettingsPanel,
    },
  ], [])

  const { accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful } = useContext(AccountContext);

  async function fetchAccountData() {
    try {

      const response = await axios.get("/trading_account/database")
      if (response.data != null) {
        setAccountTableData(response.data)
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchAccountData();
  }, [])

  if (isAccountLoginSuccessful) {
    fetchAccountData();
  }

  var data = React.useMemo(() => accountTableData, [accountTableData])

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-6">
          <AccountsTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}