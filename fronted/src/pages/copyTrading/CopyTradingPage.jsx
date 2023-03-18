import axios from 'axios';
import React from 'react'
import {useContext, useState, useEffect} from 'react';
import { async } from 'regenerator-runtime';
import CopyTradingAdd from './CopyTradingAdd';
import { AccountContext } from './../context/AccountContext';


import CopyTradingTable, { SelectColumnFilter, StatusPill, SettingsPanel, ConnectionToggle } from './CopyTradingTable'  // new

export default function CopyTradingPage()  {

    const columns = React.useMemo(() => [
        {
          Header: "Account Name",
          accessor: 'accountName',
        },
        {
          Header: "Balance",
          accessor: 'accountBalance',
        },
        {
          Header: "Connection",
          accessor: 'accountConnection',
          Cell: ConnectionToggle,
        },
        {
          Header: "Status",
          accessor: 'accountStatus',
          //Filter: SelectColumnFilter,  // new
          filter: 'includes',
          Cell: StatusPill,
        },
        {
          Header: "Settings",
          accessor: 'name',
          Cell: SettingsPanel,
        },
      ], [])

      const { accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful} = useContext(AccountContext);

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
              <CopyTradingTable columns={columns} data={data} />
            </div>
          </main>
        </div>
      );
}