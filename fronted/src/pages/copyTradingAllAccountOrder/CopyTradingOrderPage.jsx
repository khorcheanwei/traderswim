import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import CopyTradingOrderTable, { ChangeOrderPanel, viewAllOrderPanel } from './CopyTradingOrderTable'
import CopyTradingPositionPage from '../copyTradingPosition/CopyTradingPositionPage'

export default function CopyTradingOrderPage() {
  const {copyTradingOrderMainData, setCopyTradingOrderMainData} = useContext(CopyTradingOrderContext);

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'View',
      accessor: 'viewAllOrder',
      Cell: viewAllOrderPanel,
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: ChangeOrderPanel,
    },
    {
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Filled Qty',
      accessor: 'optionChainFilledQuantity',
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
  
  var data = React.useMemo(() => copyTradingOrderMainData, [copyTradingOrderMainData])

  return (
    <CopyTradingOrderTable columns={columns} data={data} />
  );
}