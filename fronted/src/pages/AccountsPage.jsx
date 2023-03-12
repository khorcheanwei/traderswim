import React from 'react'
import {useContext, useState} from 'react';
import AccountCreate from './AccountsCreate';


import AccountsTable, { SelectColumnFilter, StatusPill, SettingsPanel, ConnectionToggle } from './AccountsTable'  // new

const getData = () => {
  const data = [
    {
      account_name: 'JaneCooper',
      email: 'jane.cooper@example.com',
      name: 'Regional Paradigm Technician',
      department: 'Optimization',
      connection: 'Active',
      status: 'Active',
      balance: 275384,
    },
    {
      account_name: 'CodyFisher',
      email: 'cody.fisher@example.com',
      name: 'Product Directives Officer',
      department: 'Intranet',
      connection: 'Inactive',
      status: 'Inactive',
      balance: 454565,
    },
    {
      account_name: 'EstherHoward',
      email: 'esther.howard@example.com',
      name: 'Forward Response Developer',
      department: 'Directives',
      connection: 'Active',
      status: 'Active',
      balance: 653444,
    },
    {
      account_name: 'JennyWilson',
      email: 'jenny.wilson@example.com',
      name: 'Central Security Manager',
      department: 'Program',
      connection: 'Offline',
      status: 'Offline',
      balance: 564334,
    },
    {
      account_name: 'KristinWatson',
      email: 'kristin.watson@example.com',
      name: 'Lean Implementation Liaison',
      department: 'Mobility',
      connection: 'Inactive',
      status: 'Inactive',
      balance: 554233,
    },
    {
      account_name: 'CameronWilliamson',
      email: 'cameron.williamson@example.com',
      name: 'Internal Applications Engineer',
      department: 'Security',
      connection: 'Active',
      status: 'Active',
      balance: 2454544,
    },
  ]
  return [...data, ...data, ...data]
}


export default function AccountsPage() {

    const columns = React.useMemo(() => [
        {
          Header: "Account Name",
          accessor: 'account_name',
        },
        {
          Header: "Balance",
          accessor: 'balance',
        },
        {
          Header: "Connection",
          accessor: 'connection',
          Cell: ConnectionToggle,
        },
        {
          Header: "Status",
          accessor: 'status',
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
    
      const data = React.useMemo(() => getData(), [])

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