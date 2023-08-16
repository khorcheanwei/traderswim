import React from 'react'
import { useContext } from 'react';
import { StockCopyTradingPositionContext } from '../context/StockCopyTradingPositionContext';
import { viewAllPositionPanel, ChangePositionPanel, SettledQuantityColorChange } from './StockCopyTradingPositionTable'
import StockCopyTradingAllAccountPositionTable from './StockCopyTradingAllAccountPositionTable'

export default function StockCopyTradingPositionPage() {
  const {copyTradingPositionMainData, setCopyTradingPositionMainData} = useContext(StockCopyTradingPositionContext);

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
      Header: 'Account Id',
      accessor: 'accountId',
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

  
  var data = React.useMemo(() => copyTradingPositionMainData, [copyTradingPositionMainData])

  return (
    <StockCopyTradingAllAccountPositionTable columns={columns} data={data} />
  );
}