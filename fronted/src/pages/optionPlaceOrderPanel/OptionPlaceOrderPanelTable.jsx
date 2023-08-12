import React from 'react'
import CommonTable from '../shared/Table';

import { useContext } from 'react';
import TradingStockPlaceOrder from '../tradingStock/TradingStockPlaceOrder';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';

import Overlay from "./../Overlay";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length

  return (
    <div className="w-full">
      <div>
      </div>
    </div>
  )
}

export function CallOptionPanel(row) {
  console.log(row);
}


function OptionPlaceOrderPanelTable({ columns, data }) {
  let hiddenColumns = [];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default OptionPlaceOrderPanelTable;