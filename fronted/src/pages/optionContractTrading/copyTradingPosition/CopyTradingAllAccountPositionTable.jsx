import React from 'react'
import { useAsyncDebounce } from 'react-table'

import CommonTable from './../../shared/Table';

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
  let hiddenColumns = ['accountId', 'optionChainSymbol', 'optionChainOrderId', 'agentTradingSessionID'];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default CopyTradingAllAccountPositionTable;