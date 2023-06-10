import React from 'react'
import CommonTable from '../shared/Table';
import { useContext, useState, useEffect } from 'react';

import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';
import CopyTradingAllAccountPositionPage from './CopyTradingAllAccountPositionPage';
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

export function viewAllPositionPanel(row) {
  
  const { isOpenViewAllPosition, setIsOpenViewAllPosition } = useContext(CopyTradingPositionContext);
  const { rowCopyTradingPosition, setRowCopyTradingPosition } = useContext(CopyTradingPositionContext);

  const viewAllPositionClose = async () => {
    if (isOpenViewAllPosition == false) {
      setRowCopyTradingPosition(row)
    }
    setIsOpenViewAllPosition(!isOpenViewAllPosition)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={viewAllPositionClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full dark:bg-black">
          <span className="font-medium text-white dark:text-white">V</span>
        </div>
      </div>
      <Overlay isOpen={isOpenViewAllPosition} >
        <CopyTradingAllAccountPositionPage rowCopyTradingPosition={rowCopyTradingPosition}  onClose={viewAllPositionClose}></CopyTradingAllAccountPositionPage>
      </Overlay>
    </div>
  );
}

export function ChangePositionPanel(row) {
  const { isOpenOrderExit, setIsOpenOrderExit } = useContext(CopyTradingPositionContext);
  const { rowCopyTradingPosition, setRowCopyTradingPosition } = useContext(CopyTradingPositionContext);
 
  const orderExitClose = async () => {
    if (isOpenOrderExit == false) {
      setRowCopyTradingAccount(row)
    }
    setIsOpenOrderExit(!isOpenOrderExit)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={orderExitClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-red-600 rounded-full dark:bg-red-600">
          <span className="font-medium text-white dark:text-white">S</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderExit} >
        <TradingStockExitOrder rowCopyTradingAccount={rowCopyTradingAccount} onClose={orderExitClose}></TradingStockExitOrder>
      </Overlay>
    </div>
  );
};

function CopyTradingPositionTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingPositionTable;