import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import CopyTradingTable, { SettingsPanel } from './CopyTradingTable'

export default function CopyTradingPage() {

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
      Header: " Stock pair",
      accessor: 'stockPair',
    },
    {
      Header: "Action",
      accessor: 'stockTradeAction',
    },
    {
      Header: "Entry price",
      accessor: 'entryPrice',
    },
    {
      Header: "Order Quantity",
      accessor: 'orderQuantity',
    },
    {
      Header: "Filled Quantity",
      accessor: 'filledQuantity',
    },
    {
      Header: "Order date",
      accessor: 'orderDate',
    },
    {
      Header: "Place new order",
      accessor: 'placeNewOrder',
      Cell: SettingsPanel,
    },
  ], [])

  const { copyTradingAccountData, setCopyTradingAccountData, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful } = useContext(CopyTradingAccountContext);

  const navigate = useNavigate();

  async function fetchCopyTradingAccountData() {
    try {

      const response = await axios.get("http://localhost:4000/copy_trading_account/database")
      if (response.data != null) {
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
      <div className="min-h-screen bg-gray-100 text-black">
        <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="mt-6">
            <CopyTradingTable columns={columns} data={data} />
          </div>
        </main>
      </div>
    </div>
  );
}