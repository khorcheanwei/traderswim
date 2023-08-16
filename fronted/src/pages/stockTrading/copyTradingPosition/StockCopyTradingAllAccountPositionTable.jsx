import React from 'react'
import { useAsyncDebounce } from 'react-table'

import CommonTable from '../../shared/Table';

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return (
      <div>
      </div>
    
  )
}

function StockCopyTradingAllAccountPositionTable({ columns, data }) {
  let hiddenColumns = ['accountId', 'optionChainSymbol', 'optionChainOrderId', 'agentTradingSessionID'];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default StockCopyTradingAllAccountPositionTable;