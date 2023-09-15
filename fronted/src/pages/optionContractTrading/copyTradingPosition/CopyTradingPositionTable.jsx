import React from "react";
import CommonTable from "./../../shared/Table";
import { useContext, useState, useEffect } from "react";

import { CopyTradingPositionContext } from "./../context/CopyTradingPositionContext";
import CopyTradingAllAccountPositionPage from "./CopyTradingAllAccountPositionPage";
import TradingStockExitOrder from "../tradingStock/TradingStockExitOrder";
import Overlay from "./../../Overlay";

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

export function viewAllPositionPanel(row) {
  const { isOpenViewAllPosition, setIsOpenViewAllPosition } = useContext(
    CopyTradingPositionContext,
  );
  const { rowCopyTradingPosition, setRowCopyTradingPosition } = useContext(
    CopyTradingPositionContext,
  );

  const viewAllPositionClose = async () => {
    if (isOpenViewAllPosition == false) {
      setRowCopyTradingPosition(row);
    }
    setIsOpenViewAllPosition(!isOpenViewAllPosition);
  };

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div
          onClick={viewAllPositionClose}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-black"
        >
          <span className="font-medium text-white dark:text-white">V</span>
        </div>
      </div>
      <Overlay isOpen={isOpenViewAllPosition}>
        <CopyTradingAllAccountPositionPage
          rowCopyTradingPosition={rowCopyTradingPosition}
          onClose={viewAllPositionClose}
        ></CopyTradingAllAccountPositionPage>
      </Overlay>
    </div>
  );
}

export function ChangePositionPanel(row) {
  const { isOpenOrderExit, setIsOpenOrderExit } = useContext(
    CopyTradingPositionContext,
  );
  const { rowCopyTradingPosition, setRowCopyTradingPosition } = useContext(
    CopyTradingPositionContext,
  );

  const orderExitClose = async () => {
    if (isOpenOrderExit == false) {
      setRowCopyTradingPosition(row);
    }
    setIsOpenOrderExit(!isOpenOrderExit);
  };

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div
          onClick={orderExitClose}
          className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-red-600"
        >
          <span className="font-medium text-white dark:text-white">S</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderExit}>
        <TradingStockExitOrder
          rowCopyTradingPosition={rowCopyTradingPosition}
          onClose={orderExitClose}
        ></TradingStockExitOrder>
      </Overlay>
    </div>
  );
}

export function SettledQuantityColorChange(row) {
  let optionChainSettledQuantity =
    row.cell.row.original.optionChainSettledQuantity;

  const settledQuantityColorChange = (optionChainSettledQuantity) => {
    let className = "";
    if (optionChainSettledQuantity > 0) {
      className = "text-green-600";
    }

    if (optionChainSettledQuantity < 0) {
      className = "text-red-600";
    }

    return className;
  };
  return (
    <div>
      <span className={settledQuantityColorChange(optionChainSettledQuantity)}>
        {optionChainSettledQuantity}
      </span>
    </div>
  );
}

export function MakeSelectedPositionPanel({ row, setSelectedPositionDict }) {
  const handleSelectedPositionChange = (event) => {
    setSelectedPositionDict((prevSelectedPositionDict) => {
      const newSelectedPositionDict = { ...prevSelectedPositionDict };
      const accountUsername = row.cell.row.original.accountUsername;

      const newSelectedPosition = row.cell.row.original;

      if (
        newSelectedPositionDict.hasOwnProperty(
          row.cell.row.original.accountUsername,
        ) &&
        !event.target.checked
      ) {
        delete newSelectedPositionDict[accountUsername];
      } else {
        newSelectedPositionDict[accountUsername] = newSelectedPosition;
      }
      return newSelectedPositionDict;
    });
  };
  return (
    <div className="">
      <input
        id="selected-order-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        onChange={handleSelectedPositionChange}
      />
    </div>
  );
}

function CopyTradingPositionTable({ columns, data }) {
  let hiddenColumns = [
    "accountId",
    "optionChainSymbol",
    "optionChainOrderId",
    "agentTradingSessionID",
  ];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns });
}

export default CopyTradingPositionTable;
