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

export function PlaceOrderPanel({row, callOption}) {
  const { isOpenOrderPlace, setIsOpenOrderPlace } = useContext(CopyTradingOrderContext);
  const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(CopyTradingOrderContext);

  const orderPlaceClose = async () => {
    if (isOpenOrderPlace == false) {
      setRowCopyTradingOrder(row)
    }
    setIsOpenOrderPlace(!isOpenOrderPlace)
  }

  let place_order_class = "cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full "
  if (callOption) {
    place_order_class = place_order_class + " bg-green-700"
  } else {
    place_order_class = place_order_class + " bg-red-700"
  }
  

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={orderPlaceClose} className={place_order_class}>
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