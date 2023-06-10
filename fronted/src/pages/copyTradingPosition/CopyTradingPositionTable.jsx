import React from 'react'
import CommonTable from '../shared/Table';
import { useContext, useState, useEffect } from 'react';

import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import CopyTradingPositionPage from './CopyTradingPositionPage';
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

export function viewAllPositionsPanel(row) {
  
  const { isOpenViewAllPositions, setIsOpenViewAllPositions } = useContext(CopyTradingAccountContext);
  const { rowCopyTradingAccount, setRowCopyTradingAccount } = useContext(CopyTradingAccountContext);

  const viewAllPositionsClose = async () => {
    if (isOpenViewAllPositions == false) {
      setRowCopyTradingAccount(row)
    }
    setIsOpenViewAllPositions(!isOpenViewAllPositions)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={viewAllPositionsClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full dark:bg-black">
          <span className="font-medium text-white dark:text-white">V</span>
        </div>
      </div>
      <Overlay isOpen={isOpenViewAllPositions} >
        <CopyTradingPositionPage rowCopyTradingAccount={rowCopyTradingAccount}  onClose={viewAllPositionsClose}></CopyTradingPositionPage>
      </Overlay>
    </div>
  );
}

function CopyTradingPositionTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingPositionTable;