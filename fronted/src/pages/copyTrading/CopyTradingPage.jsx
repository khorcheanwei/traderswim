import axios from 'axios';
import React from 'react'
import {useContext, useState, useEffect} from 'react';
import { async } from 'regenerator-runtime';
import CopyTradingAdd from './CopyTradingAdd';
import { AccountContext } from './../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';



import CopyTradingTable, { SelectColumnFilter, StatusPill, SettingsPanel, ConnectionToggle } from './CopyTradingTable'  // new

const getData = () => {
  const data = [
    {
      accountName: 'JaneCooper',
      accountBalance: 1000,
      copyFromMasterAccount: 'Jace',
      tradeRiskType: "Fixed Account",
      tradeRiskPercent: 100,
      accountConnection: false,
      status: 'Active',
    }, 
    {
      accountName: 'JaneCooper',
      accountBalance: 1000,
      copyFromMasterAccount: 'Jace',
      tradeRiskType: "Fixed Account",
      tradeRiskPercent: 100,
      accountConnection: true,
      status: 'Active',
    }
  ]
  return [...data]
}

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
          Header: "Copy From",
          accessor: 'copyFromMasterAccount',
        },
        {
          Header: "Trade risk type",
          accessor: 'tradeRiskType',
        },
        {
          Header: "Trade risk %",
          accessor: 'tradeRiskPercent',
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