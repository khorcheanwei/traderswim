import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from './../shared/Button'
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import CopyTradingDeleteOrderConfirmation from './CopyTradingDeleteOrderConfirmation';
import TradingStock from '../tradingStock/TradingStock';
import TradingStockReplaceOrder from '../tradingStock/TradingStockReplaceOrder';
import TradingStockExitOrder from '../tradingStock/TradingStockExitOrder';

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

export function SettingsPanel(row) {
  const { isOpenTradingStock, setIsOpenTradingStock, isOpenOrderExit, setIsOpenOrderExit,  isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete } = useContext(CopyTradingAccountContext);
  
  const { rowCopyTradingAccount, setRowCopyTradingAccount } = useContext(CopyTradingAccountContext);
 

  const placeOrderClose = async () => {
    if (isOpenTradingStock == false) {
      setRowCopyTradingAccount(row)
    }
    setIsOpenTradingStock(!isOpenTradingStock)
  }

  const orderExitClose = async () => {
    if (isOpenOrderExit == false) {
      setRowCopyTradingAccount(row)
    }
    setIsOpenOrderExit(!isOpenOrderExit)
  }

  const orderReplaceClose = async () => {
    if (isOpenOrderReplace == false) {
      setRowCopyTradingAccount(row)
    }
    setIsOpenOrderReplace(!isOpenOrderReplace)
  }

  const orderDeleteClose = async () => {
    if (isOpenOrderDelete == false) {
      setRowCopyTradingAccount(row)
    }
    setIsOpenOrderDelete(!isOpenOrderDelete)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={orderExitClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-red-600 rounded-full dark:bg-red-600">
          <span className="font-medium text-white dark:text-white">S</span>
        </div>
        <div onClick={orderReplaceClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-yellow-300 rounded-full dark:bg-yellow-300">
        <span className="font-medium text-white dark:text-white">R</span>
        </div>
        <div onClick={orderDeleteClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-middleGreen rounded-full dark:bg-middleGreen">
          <span className="font-medium text-white dark:text-white">C</span>
        </div>
      </div>
      <Overlay isOpen={isOpenTradingStock} >
        <TradingStock onClose={placeOrderClose}></TradingStock>
      </Overlay>
      <Overlay isOpen={isOpenOrderExit} >
        <TradingStockExitOrder rowCopyTradingAccount={rowCopyTradingAccount} onClose={orderExitClose}></TradingStockExitOrder>
      </Overlay>
      <Overlay isOpen={isOpenOrderReplace} >
        <TradingStockReplaceOrder rowCopyTradingAccount={rowCopyTradingAccount} onClose={orderReplaceClose}></TradingStockReplaceOrder>
      </Overlay>
      <Overlay isOpen={isOpenOrderDelete} >
        <CopyTradingDeleteOrderConfirmation rowCopyTradingAccount={rowCopyTradingAccount} onClose={orderDeleteClose}></CopyTradingDeleteOrderConfirmation>
      </Overlay>
    </div>
  );
};

function CopyTradingTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingTable;