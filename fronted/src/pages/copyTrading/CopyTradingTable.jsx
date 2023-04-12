import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from './../shared/Button'
import { classNames } from './../shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './../shared/Icons'
import {useContext, useState, useEffect} from 'react';
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

export function StatusPill(row) {

  var accountStatus = "offline";
  if (row.value == true) {
    accountStatus = "online";
  } 

  return (
    <span
      className={
        classNames(
          "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
          accountStatus.startsWith("online") ? "bg-green-100 text-green-800" : null,
          accountStatus.startsWith("offline") ? "bg-red-100 text-red-800" : null,
        )
      }
    >
      {accountStatus}
    </span>
  );
};

export function SettingsPanel(rowCopyTrading) {
  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingAccountContext);

  const orderQuantity = rowCopyTrading.cell.row.original.orderQuantity;
  const filledQuantity = rowCopyTrading.cell.row.original.filledQuantity;

  var  disabledPlaceOrder = true;

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




export function ConnectionToggle(row) {
  const {copyTradingAccountData, setCopyTradingAccountData, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful} = useContext(CopyTradingAccountContext);
  var checked_state = false;

  if (row.value == true) {
    checked_state = true
  }

  async function updateAccountConnection(accountName, accountConnection) {
    try {
      await axios.post("/trading_account/connection", {accountName, accountConnection})
      var response = await axios.get("/copy_trading_account/database")
      if (response.data != null) {
        setCopyTradingAccountData(response.data)
      }

    } catch (error) {
      console.error(error);
    }
  }

  function handleConnectionChange() {
    var accountName = row.cell.row.original.accountName
    updateAccountConnection(accountName, !checked_state)
  }

  return (
    <label className="relative inline-flex content-center">
      <input type="checkbox" value="" className="sr-only peer" checked={checked_state} onChange={handleConnectionChange}></input>
      <div className="w-11 h-6 cursor-pointer bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-800"></div>
    </label>
  );
};

function CopyTradingTable({ columns, data }) {
  return CommonTable({columns, data, GlobalFilter})
}

export default CopyTradingTable;