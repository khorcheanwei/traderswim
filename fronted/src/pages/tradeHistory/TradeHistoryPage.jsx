
import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { async } from 'regenerator-runtime';
import { UserContext } from '../context/UserContext';
import { TradeHistoryContext } from '../context/TradeHistoryContext';
import TradingActivityTable from './TradeHistoryTable'
import { Link, Navigate, useNavigate } from 'react-router-dom';


export default function TradeActivityPage() {

  const columns = React.useMemo(() => [
    {
      Header: "Trading Session ID",
      accessor: "agentTradingSessionID",
    },
    {
      Header: "Name",
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    },
    {
      Header: 'Time',
      accessor: 'optionChainEnteredTime',
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'optionChainInstruction',
    },
    {
      Header: 'Qty',
      accessor: 'optionChainQuantity',
    },
    {
      Header: 'Filled Qty',
      accessor: 'optionChainFilledQuantity',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Price',
      accessor: 'optionChainPrice',
    },
    {
      Header: 'Order type',
      accessor: 'optionChainOrderType',
    },
    {
      Header: 'Status',
      accessor: 'optionChainStatus',
    },
  ], [])

  const { tradeHistoryTableData, setTradeHistoryTableData } = useContext(TradeHistoryContext);
  const navigate = useNavigate();

  async function fetchTradeHistoryData() {
    try {
      const response = await axios.get("/copy_trading_account/trade_history_database")

      if (response.data != null) {
        setTradeHistoryTableData(response.data)
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    fetchTradeHistoryData();
  }, [])

  /*
  if (isAccountLoginSuccessful) {
    fetchAccountData();
  } */

  var data = React.useMemo(() => tradeHistoryTableData, [tradeHistoryTableData])


  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-6">
          <TradingActivityTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}

