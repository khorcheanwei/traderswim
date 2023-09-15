import React from "react";
import CommonTable from "./../../shared/Table";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return (
    <div className="w-full">
      <div></div>
    </div>
  );
}

export function CallOptionPanel(row) {
  console.log(row);
}

function OptionPlaceOrderPanelTable({ columns, data }) {
  let hiddenColumns = [];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns });
}

export default OptionPlaceOrderPanelTable;
