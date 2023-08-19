import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { useContext  } from 'react';

import StockDeleteOrderIndividual from './../tradingStock/StockDeleteOrderIndividual';
import StockReplaceOrderIndividual from './../tradingStock/StockReplaceOrderIndividual';

import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';

import CommonTable from './../../shared/Table';
import Overlay from "./../../Overlay";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return (
      <div>
      </div>
  )
}

function getStockStatusColor(stockStatus) {
  let stockOwnStatusColor = true;
  let stockStatusInactiveList = ["REJECTED", "CANCELED", "FILLED", "EXPIRED"];
  if (!stockStatusInactiveList.includes(stockStatus)) {
    stockOwnStatusColor = false;
  }
  return stockOwnStatusColor
}

export function TextStockSymbolColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockSymbol = row.cell.row.original.stockSymbol;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockSymbol}</div>
        : <div className="text-yellow-700">{stockSymbol}</div>
      }
    </div>
  )
}

export function TextStockFilledQuantityColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockFilledQuantity = row.cell.row.original.stockFilledQuantity;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockFilledQuantity}</div>
        : <div className="text-yellow-700">{stockFilledQuantity}</div>
      }
    </div>
  )
}

export function TextStockPriceColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockPrice = row.cell.row.original.stockPrice;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockPrice}</div>
        : <div className="text-yellow-700">{stockPrice}</div>
      }
    </div>
  )
}


export function TextStockQuantityColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockQuantity = row.cell.row.original.stockQuantity;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockQuantity}</div>
        : <div className="text-yellow-700">{stockQuantity}</div>
      }
    </div>
  )
}


export function TextStockInstructionColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockInstruction = row.cell.row.original.stockInstruction;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockInstruction}</div>
        : <div className="text-yellow-700">{stockInstruction}</div>
      }
    </div>
  )
}


export function TextStockStatusColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockStatus}</div>
        : <div className="text-yellow-700">{stockStatus}</div>
      }
    </div>
  )
}


export function TextStockOrderTypeColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockOrderType = row.cell.row.original.stockOrderType;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockOrderType}</div>
        : <div className="text-yellow-700">{stockOrderType}</div>
      }
    </div>
  )
}


export function TextStockEnteredTimeColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let stockEnteredTime = row.cell.row.original.stockEnteredTime;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{stockEnteredTime}</div>
        : <div className="text-yellow-700">{stockEnteredTime}</div>
      }
    </div>
  )
}


export function TextAccountNameColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let accountName = row.cell.row.original.accountName;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{accountName}</div>
        : <div className="text-yellow-700">{accountName}</div>
      }
    </div>
  )
}

export function TextAccountUsernameColorPanel(row) {
  let stockStatus = row.cell.row.original.stockStatus;
  let stockOwnStatusColor = getStockStatusColor(stockStatus);
  let accountUsername = row.cell.row.original.accountUsername;
  return (
    <div>
      {stockOwnStatusColor
        ? <div>{accountUsername}</div>
        : <div className="text-yellow-700">{accountUsername}</div>
      }
    </div>
  )
}


export function MakeSelectedOrderPanel({row, setSelectedOrderDict}) {
  
  const handleSelectedOrderChange = (event) => {

    setSelectedOrderDict((prevSelectedOrderDict) => {
      const newSelectedOrderDict = { ...prevSelectedOrderDict };
      const accountUsername = row.cell.row.original.accountUsername;

      const newSelectedOrder = {
        accountId: row.cell.row.original.accountId,
        accountName: row.cell.row.original.accountName,
        accountUsername: row.cell.row.original.accountUsername,
        stockOrderId: row.cell.row.original.stockOrderId
      }

      if (newSelectedOrderDict.hasOwnProperty(row.cell.row.original.accountUsername) && !event.target.checked) {
        delete newSelectedOrderDict[accountUsername];
      } else {
        newSelectedOrderDict[accountUsername] = newSelectedOrder;
      }
      return newSelectedOrderDict;
    });
  };
  return (
    <div className="">
      <input 
        id="selected-order-checkbox" 
        type="checkbox" 
        value="" 
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        onChange={handleSelectedOrderChange}
      />
    </div>
  )
}

export function ChangeOrderIndividualPanel(row) {
  const { isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual, isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual } = useContext(StockCopyTradingOrderContext);
  
  const { rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual } = useContext(StockCopyTradingOrderContext);

  const orderReplaceCloseIndividual = async () => {
    if (isOpenOrderReplaceIndividual == false) {
      setRowCopyTradingOrderIndividual(row)
    }
    setIsOpenOrderReplaceIndividual(!isOpenOrderReplaceIndividual)
  }

  const orderDeleteCloseIndividual = async () => {
    if (isOpenOrderDeleteIndividual == false) {
      setRowCopyTradingOrderIndividual(row)
    }
    setIsOpenOrderDeleteIndividual(!isOpenOrderDeleteIndividual)
  }

  return (
    <div className="flex">
      <div className="flex space-x-2">
        <div onClick={orderReplaceCloseIndividual} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-yellow-300">
        <span className="font-medium text-white dark:text-white">R</span>
        </div>
        <div onClick={orderDeleteCloseIndividual} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-middleGreen">
          <span className="font-medium text-white dark:text-white">C</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderReplaceIndividual} >
        <StockReplaceOrderIndividual rowCopyTradingOrderIndividual={rowCopyTradingOrderIndividual} onClose={orderReplaceCloseIndividual}></StockReplaceOrderIndividual>
      </Overlay>
      <Overlay isOpen={isOpenOrderDeleteIndividual} >
        <StockDeleteOrderIndividual rowCopyTradingOrderIndividual={rowCopyTradingOrderIndividual} onClose={orderDeleteCloseIndividual}></StockDeleteOrderIndividual>
      </Overlay>
    </div>
  );
};

function StockCopyTradingAllAccountOrderTable({ columns, data }) {
  let hiddenColumns = ['accountId', 'stockOrderId', 'agentTradingSessionID', 'stockOwnStatusColor'];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default StockCopyTradingAllAccountOrderTable;