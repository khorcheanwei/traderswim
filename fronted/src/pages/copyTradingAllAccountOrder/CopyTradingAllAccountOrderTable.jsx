import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from '../shared/Button'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import TradingStockPlaceOrder from '../tradingStock/TradingStockPlaceOrder';

import Overlay from "../Overlay";
import CommonTable from '../shared/Table';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingAccountContext);

  const placeOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }

  return (
    
      <div>
        <Overlay isOpen={isOpenTradingStock} >
          <TradingStockPlaceOrder onClose={placeOrderClose}></TradingStockPlaceOrder>
        </Overlay>
      </div>
    
  )
}

function CopyTradingAllAccountOrderTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingAllAccountOrderTable;