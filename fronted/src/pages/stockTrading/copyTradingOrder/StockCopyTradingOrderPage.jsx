import React from 'react'
import { useContext } from 'react';

import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';
import StockCopyTradingOrderTable, { ChangeOrderPanel, ViewAllOrderPanel, StockStatusColorPanel } from './StockCopyTradingOrderTable'

export default function StockCopyTradingOrderPage() {
  const {stockCopyTradingOrderMainData, setStockCopyTradingOrderMainData} = useContext(StockCopyTradingOrderContext);

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'Account Id',
      accessor: 'accountId',
    },
    {
      Header: 'View',
      accessor: 'viewAllOrder',
      Cell: ViewAllOrderPanel,
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: ChangeOrderPanel,
    },
    {
      Header: 'Symbol',
      accessor: 'stockSymbol',
    },
    {
      Header: 'Session',
      accessor: 'stockSession',
    },
    {
      Header: 'Duration',
      accessor: 'stockDuration',
    },
    {
      Header: 'Stock order Id',
      accessor: 'stockOrderId',
    },
    {
      Header: 'Filled Qty',
      accessor: 'stockFilledQuantity',
    },
    {
      Header: 'Price',
      accessor: 'stockPrice',
    },
    {
      Header: 'Stop Price',
      accessor: 'stockStopPrice',
    },
    {
      Header: 'Stop Price Link Type',
      accessor: 'stockStopPriceLinkType',
    },
    {
      Header: 'Stop Price Offset',
      accessor: 'stockStopPriceOffset',
    },
    {
      Header: 'Qty',
      accessor: 'stockQuantity',
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'stockInstruction',
    },
    {
      Header: 'Status',
      accessor: 'stockStatus',
    },
    {
      Header: 'Order type',
      accessor: 'stockOrderType',
    },
    {
      Header: 'Time',
      accessor: 'stockEnteredTime',
    },
    {
      Header: 'Status', 
      accessor: 'stockStatusColor',
      Cell: StockStatusColorPanel,
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

  var data = React.useMemo(() => stockCopyTradingOrderMainData, [stockCopyTradingOrderMainData]);

  return (
    <StockCopyTradingOrderTable columns={columns} data={data} />
  );
}