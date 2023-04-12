import axios from 'axios';
import React from 'react'
import {useContext, useState, useEffect} from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';
import { Link , Navigate, useNavigate} from 'react-router-dom';


import AccountsTable, { StatusPill, SettingsPanel, ConnectionToggle } from './AccountTable'  // new

export default function AccountsPage() {

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
          filter: 'includes',
          Cell: StatusPill,
        },
        {
          Header: "Settings",
          accessor: 'name',
          Cell: SettingsPanel,
        },
      ], [])

      const { contextAgentUsername, setContextAgentUsername} = useContext(UserContext);
      const { accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful} = useContext(AccountContext);
      const navigate = useNavigate();
      
      async function fetchAccountData() {
        try {
          if (contextAgentUsername == null) {
            await axios.get("/agent_account/profile").then(({data}) =>{
                if (data != null) {
                  setContextAgentUsername(data.agentUsername);
                } else {
                  navigate('/login')
                }
            })  
          }

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