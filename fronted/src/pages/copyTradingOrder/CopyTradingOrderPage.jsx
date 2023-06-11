import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import CopyTradingOrderTable, { ChangeOrderPanel, viewAllOrderPanel } from './CopyTradingOrderTable'

export default function CopyTradingOrderPage() {
  const {copyTradingMainAccountData, setCopyTradingMainAccountData} = useContext(CopyTradingAccountContext);

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
  
  var data = React.useMemo(() => copyTradingMainAccountData, [copyTradingMainAccountData])

  return (
    <CopyTradingOrderTable columns={columns} data={data} />
  );
}