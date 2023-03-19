import axios from 'axios';
import React from 'react'
import {useContext, useState, useEffect} from 'react';
import { async } from 'regenerator-runtime';
import CopyTradingAdd from './CopyTradingAdd';
import { AccountContext } from './../context/AccountContext';


import CopyTradingTable, { SelectColumnFilter, StatusPill, SettingsPanel, ConnectionToggle } from './CopyTradingTable'  // new

const getData = () => {
  const data = [
    {
      accountName: 'JaneCooper',
      accountBalance: 1000,
      title: 'Regional Paradigm Technician',
      department: 'Optimization',
      status: 'Active',
      role: 'Admin',
      age: 27,
      imgUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      accountName: 'CodyFisher',
      accountBalance: 1000,
      title: 'Product Directives Officer',
      department: 'Intranet',
      status: 'Inactive',
      role: 'Owner',
      age: 43,
      imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
      accountName: 'EstherHoward',
      accountBalance: 1000,
      title: 'Forward Response Developer',
      department: 'Directives',
      status: 'Active',
      role: 'Member',
      age: 32,
      imgUrl: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
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
          accessor: 'accountTradeRiskPercent',
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
        return
        try {
          const response = await axios.get("/copy_trading_account/accont_name_list")
          console.log(response);
          /*
          if (response.data != null) {
            setAccountTableData(response.data)
          }*/
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
      
      var data = React.useMemo(() => getData(), [getData()])

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