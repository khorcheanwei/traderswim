import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { viewAllPositionPanel, ChangePositionPanel, SettledQuantityColorChange } from './CopyTradingPositionTable'
import CopyTradingAllAccountPositionTable from './CopyTradingAllAccountPositionTable'

export default function CopyTradingPositionPage() {
  const {copyTradingPositionMainAccountData, setCopyTradingPositionMainAccountData} = useContext(CopyTradingPositionContext);

  const columns = React.useMemo(() => [
    {
      Header: 'View',
      accessor: 'viewAllOrder',
      Cell: viewAllPositionPanel,
    },
    {
      Header: 'Change position',
      accessor: 'ChangePosition',
      Cell: ChangePositionPanel,
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
      Header: 'Settled Qty',
      accessor: 'optionChainSettledQuantity',
      Cell: SettledQuantityColorChange,
    },
    {
      Header: 'Average price',
      accessor: 'optionChainAveragePrice',
    },
    {
      Header: 'Name',
      accessor: 'accountName',
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
    }
  ], [])

  
  var data = React.useMemo(() => copyTradingPositionMainAccountData, [copyTradingPositionMainAccountData])

  return (
    <CopyTradingAllAccountPositionTable columns={columns} data={data} />
  );
}