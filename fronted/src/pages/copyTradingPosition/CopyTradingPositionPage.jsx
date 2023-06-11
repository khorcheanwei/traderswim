import axios from 'axios';
import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { viewAllPositionPanel } from './CopyTradingPositionTable'
import CopyTradingAllAccountPositionTable from './CopyTradingAllAccountPositionTable'

export default function CopyTradingPositionPage() {
  //const {copyTradingPositionMainAccountData, setCopyTradingPositionMainAccountData} = useContext(CopyTradingPositionContext);

  const columns = React.useMemo(() => [
    {
      Header: 'View',
      accessor: 'viewAllOrder',
      Cell: viewAllPositionPanel,
    },
    /*{
      Header: 'Change position',
      accessor: 'ChangePosition',
      Cell: viewAllPositionPanel,
    },*/
    {
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Average price',
      accessor: 'optionChainAveragePrice',
    },
    {
      Header: 'Long Qty',
      accessor: 'optionChainLongQuantity',
    },
    {
      Header: 'Settled Long Qty',
      accessor: 'optionChainSettledLongQuantity',
    },
    {
      Header: 'Short Qty',
      accessor: 'optionChainShortQuantity',
    },
    {
      Header: 'Settled Short Qty',
      accessor: 'optionChainSettledShortQuantity',
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

  
  //var data = React.useMemo(() => copyTradingPositionMainAccountData, [copyTradingPositionMainAccountData])

  return (
    {/*<CopyTradingAllAccountPositionTable columns={columns} data={data} />*/}
  );
}