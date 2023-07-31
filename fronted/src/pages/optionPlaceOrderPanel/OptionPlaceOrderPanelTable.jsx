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

export function PlaceOrderPanel(row) {
  const { isOpenOrderPlace, setIsOpenOrderPlace } = useContext(CopyTradingOrderContext);
  const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(CopyTradingOrderContext);

  const orderPlaceClose = async () => {
    if (isOpenOrderPlace == false) {
      setRowCopyTradingOrder(row)
    }
    setIsOpenOrderPlace(!isOpenOrderPlace)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={orderPlaceClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-violet-700 rounded-full">
          <span className="font-medium text-white dark:text-white">P</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderPlace} >
        <TradingStockPlaceOrder rowCopyTradingOrder={rowCopyTradingOrder} onClose={orderPlaceClose}></TradingStockPlaceOrder>
      </Overlay>
    </div>
  );
};

function OptionPlaceOrderPanelTable({ columns, data }) {
  let hiddenColumns = [];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default OptionPlaceOrderPanelTable;