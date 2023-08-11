import axios from 'axios';
import React, { useState } from 'react'
import CommonTable from '../shared/Table';

import { useContext } from 'react';
import TradingStockPlaceOrder from '../tradingStock/TradingStockPlaceOrder';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';

import Overlay from "../Overlay";

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

export function SettingsPanel(row) {
  let optionChainSymbol = row.cell.row.original.optionChainSymbol;

  const optionContractSaveOrderDeleteClose = async () => {
    const response = await axios.delete("/option_contract_save_order/remove_option_contract_save_order/", { data:{ "optionChainSymbol": optionChainSymbol }});
    if (response.data.success != true) {
        alert("Remove option contract save order failed");
    } else {
        alert("Remove option contract save order successful");
    }

    /*
    const list = [...optionContractTickerList];
    list.splice(index, 1);
    setOptionContractTickerList(list);*/
  };
  

  return (
    <div className="flex">
      <svg onClick={optionContractSaveOrderDeleteClose} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </div>
  );
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
  let place_order_button_class = "flex "
  let place_order_class = "cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full "
  if (callOption) {
    place_order_class = place_order_class + "bg-green-700"
  } else {
    place_order_button_class = place_order_button_class + "justify-end"
    place_order_class = place_order_class + "bg-red-700"
  }
  

  return (
    <div className={place_order_button_class}>
        <div onClick={orderPlaceClose} className={place_order_class}>
        <span className="font-medium text-white dark:text-white">P</span>
      </div>
      <Overlay isOpen={isOpenOrderPlace} >
        <TradingStockPlaceOrder rowCopyTradingOrder={rowCopyTradingOrder} onClose={orderPlaceClose}></TradingStockPlaceOrder>
      </Overlay>
    </div>
  );
};

function OptionPlaceSaveOrderPanelTable({ columns, data }) {
  let hiddenColumns = [];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default OptionPlaceSaveOrderPanelTable;