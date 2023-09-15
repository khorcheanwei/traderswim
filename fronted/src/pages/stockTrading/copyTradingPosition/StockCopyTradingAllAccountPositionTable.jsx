import React from "react";
import { useAsyncDebounce } from "react-table";

import CommonTable from "../../shared/Table";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return <div></div>;
}

export function MakeSelectedStockPositionPanel({
  row,
  setSelectedPositionDict,
}) {
  const handleSelectedPositionChange = (event) => {
    setSelectedPositionDict((prevSelectedPositionDict) => {
      const newSelectedPositionDict = { ...prevSelectedPositionDict };
      const accountUsername = row.cell.row.original.accountUsername;

      const newSelectedPosition = row.cell.row.original;

      if (
        newSelectedPositionDict.hasOwnProperty(
          row.cell.row.original.accountUsername,
        ) &&
        !event.target.checked
      ) {
        delete newSelectedPositionDict[accountUsername];
      } else {
        newSelectedPositionDict[accountUsername] = newSelectedPosition;
      }
      return newSelectedPositionDict;
    });
  };
  return (
    <div className="">
      <input
        id="selected-order-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        onChange={handleSelectedPositionChange}
      />
    </div>
  );
}

function StockCopyTradingAllAccountPositionTable({ columns, data }) {
  let hiddenColumns = [
    "accountId",
    "optionChainSymbol",
    "optionChainOrderId",
    "agentTradingSessionID",
  ];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns });
}

export default StockCopyTradingAllAccountPositionTable;
