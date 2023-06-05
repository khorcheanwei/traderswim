import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from './../shared/Button'
import { classNames } from './../shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './../shared/Icons'
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import TradingStock from '../tradingStock/TradingStock';

import axios from 'axios';
import Overlay from "./../Overlay";
import { async } from 'regenerator-runtime'
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
    <div className="w-full">
      <div className="flex justify-between items-center">
        <label className="flex gap-x-2 items-baseline">
          <span className="text-gray-700">Search: </span>
          <input
            type="text"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={value || ""}
            onChange={e => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={`${count} records...`}
          />
        </label>
        <div className="flex gap-6 h-12">
          <Button className="text-gray-700 " onClick={placeOrderClose}>BUY/SELL</Button>
        </div>
      </div>
      <div>
        <Overlay isOpen={isOpenTradingStock} >
          <TradingStock onClose={placeOrderClose}></TradingStock>
        </Overlay>
      </div>
    </div>
  )
}

export function SettingsPanel(rowCopyTrading) {
  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingAccountContext);

  const orderQuantity = rowCopyTrading.cell.row.original.orderQuantity;
  const filledQuantity = rowCopyTrading.cell.row.original.filledQuantity;

  var disabledPlaceOrder = true;

  if (filledQuantity < orderQuantity) {
    disabledPlaceOrder = false
  }

  function changePlaceOrderOpacity(disabled) {
    let classes = "h-6 w-6"
    if (disabled) {
      classes += " opacity-25"
    } else {
      classes += " cursor-pointer"
    }
    return classes
  }

  const placeOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }

  return (
    <div className="flex">
      <svg onClick={placeOrderClose} xmlns="http://www.w3.org/2000/svg" className={changePlaceOrderOpacity(disabledPlaceOrder)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <Overlay isOpen={isOpenTradingStock} >
        <TradingStock onClose={placeOrderClose}></TradingStock>
      </Overlay>
    </div>
  );
};

function CopyTradingPositionTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingPositionTable;