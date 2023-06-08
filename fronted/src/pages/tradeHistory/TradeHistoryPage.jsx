
import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { TradeHistoryContext } from '../context/TradeHistoryContext';
import TradingActivityTable from './TradeHistoryTable'

export default function TradeActivityPage() {

  const columns = React.useMemo(() => [
    {
      Header: "Trading Session ID",
      accessor: "agentTradingSessionID",
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

  const { tradeHistoryTableData, setTradeHistoryTableData } = useContext(TradeHistoryContext);

  async function fetchTradeHistoryData() {
    console.log("kcw")
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

