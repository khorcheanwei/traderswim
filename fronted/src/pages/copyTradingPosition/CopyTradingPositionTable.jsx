import React from 'react'
import CommonTable from '../shared/Table';

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

function CopyTradingPositionTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingPositionTable;