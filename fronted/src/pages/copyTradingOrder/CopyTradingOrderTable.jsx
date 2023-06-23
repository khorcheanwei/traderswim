import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { Button, PageButton } from './../shared/Button'
import { useContext, useState, useEffect } from 'react';

import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import TradingStockDeleteOrder from '../tradingStock/TradingStockDeleteOrder';
import TradingStockReplaceOrder from '../tradingStock/TradingStockReplaceOrder';
import CopyTradingAllAccountOrderPage from '../copyTradingOrder/CopyTradingAllAccountOrderPage';

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

  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingOrderContext);

  const placeOrderClose = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }

  return (
    <div></div>
  )
}

export function ViewAllOrderPanel(row) {
  const { isOpenViewAllOrder, setIsOpenViewAllOrder } = useContext(CopyTradingOrderContext);
  const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(CopyTradingOrderContext);

  const viewAllOrderClose = async () => {
    if (isOpenViewAllOrder == false) {
      setRowCopyTradingOrder(row)
    }
    setIsOpenViewAllOrder(!isOpenViewAllOrder)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={viewAllOrderClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full dark:bg-black">
          <span className="font-medium text-white dark:text-white">V</span>
        </div>
      </div>
      <Overlay isOpen={isOpenViewAllOrder} >
        <CopyTradingAllAccountOrderPage rowCopyTradingOrder={rowCopyTradingOrder}  onClose={viewAllOrderClose}></CopyTradingAllAccountOrderPage>
      </Overlay>
    </div>
  );
}

export function ChangeOrderPanel(row) {
  const { isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete } = useContext(CopyTradingOrderContext);
  
  const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(CopyTradingOrderContext);

  const orderReplaceClose = async () => {
    if (isOpenOrderReplace == false) {
      setRowCopyTradingOrder(row)
    }
    setIsOpenOrderReplace(!isOpenOrderReplace)
  }

  const orderDeleteClose = async () => {
    if (isOpenOrderDelete == false) {
      setRowCopyTradingOrder(row)
    }
    setIsOpenOrderDelete(!isOpenOrderDelete)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={orderReplaceClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-yellow-300 rounded-full dark:bg-yellow-300">
        <span className="font-medium text-white dark:text-white">R</span>
        </div>
        <div onClick={orderDeleteClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-middleGreen rounded-full dark:bg-middleGreen">
          <span className="font-medium text-white dark:text-white">C</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderReplace} >
        <TradingStockReplaceOrder rowCopyTradingOrder={rowCopyTradingOrder} onClose={orderReplaceClose}></TradingStockReplaceOrder>
      </Overlay>
      <Overlay isOpen={isOpenOrderDelete} >
        <TradingStockDeleteOrder rowCopyTradingOrder={rowCopyTradingOrder} onClose={orderDeleteClose}></TradingStockDeleteOrder>
      </Overlay>
    </div>
  );
};

export function OptionChainStatusColorPanel(row) {
  <span className="font-medium text-white dark:text-white">R</span>

  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;

  return (
    <div>
      {optionChainStatusColor
        ? <span className='bg-green-500 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'></span>
        : <span className='bg-red-500 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'></span>
      }
    </div>
  );
}

function CopyTradingOrderTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingOrderTable;