import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from '../shared/Button'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import TradingStock from '../tradingStock/TradingStock';

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
  return (
      <div>
      </div>
    
  )
}

function CopyTradingAllAccountPositionTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingAllAccountPositionTable;