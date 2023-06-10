import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import CopyTradingOrderTable, { SettingsPanel, viewAllOrdersPanel } from './CopyTradingOrderTable'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'

export default function CopyTradingOrderPage() {

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'View',
      accessor: 'viewAllOrders',
      Cell: viewAllOrdersPanel,
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: SettingsPanel,
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

  const [copyTradingAccountData, setCopyTradingAccountData] = useState([]);
  
  async function fetchCopyTradingAccountData() {
    try {
      const response = await axios.get('/copy_trading_account/database')
      if (response.data != null && response.data.length != 0) {
        setCopyTradingAccountData(response.data)
      }

      await axios.get('/trading_account/database');

    } catch (error) {
      console.log(error.message);
    }
  }

  const ref = useRef(null)
  useEffect(() => {
    ref.current = setInterval(fetchCopyTradingAccountData, 2 * 1000);
    return () => {
      if(ref.current){
        clearInterval(ref.current);
      }
    }
  }, [])

  var data = React.useMemo(() => copyTradingAccountData, [copyTradingAccountData])

  return (
    <CopyTradingOrderTable columns={columns} data={data} />
  );
}