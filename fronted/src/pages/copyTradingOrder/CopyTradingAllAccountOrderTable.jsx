import React from 'react'
import { useAsyncDebounce } from 'react-table'
import { useContext  } from 'react';

import TradingStockDeleteOrderIndividual from '../tradingStock/TradingStockDeleteOrderIndividual';
import TradingStockReplaceOrderIndividual from '../tradingStock/TradingStockReplaceOrderIndividual';

import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';

import CommonTable from '../shared/Table';
import Overlay from "./../Overlay";

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

  return (
      <div>
      </div>
  )
}

export function TextOptionChainDescriptionColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainDescription = row.cell.row.original.optionChainDescription;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainDescription}</div>
        : <div className="text-yellow-700">{optionChainDescription}</div>
      }
    </div>
  )
}

export function TextOptionChainFilledQuantityColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainFilledQuantity = row.cell.row.original.optionChainFilledQuantity;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainFilledQuantity}</div>
        : <div className="text-yellow-700">{optionChainFilledQuantity}</div>
      }
    </div>
  )
}


export function TextOptionChainPriceColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainPrice = row.cell.row.original.optionChainPrice;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainPrice}</div>
        : <div className="text-yellow-700">{optionChainPrice}</div>
      }
    </div>
  )
}


export function TextOptionChainQuantityColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainQuantity = row.cell.row.original.optionChainQuantity;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainQuantity}</div>
        : <div className="text-yellow-700">{optionChainQuantity}</div>
      }
    </div>
  )
}


export function TextOptionChainInstructionColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainInstruction = row.cell.row.original.optionChainInstruction;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainInstruction}</div>
        : <div className="text-yellow-700">{optionChainInstruction}</div>
      }
    </div>
  )
}


export function TextOptionChainStatusColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainStatus = row.cell.row.original.optionChainStatus;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainStatus}</div>
        : <div className="text-yellow-700">{optionChainStatus}</div>
      }
    </div>
  )
}


export function TextOptionChainOrderTypeColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainOrderType = row.cell.row.original.optionChainOrderType;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainOrderType}</div>
        : <div className="text-yellow-700">{optionChainOrderType}</div>
      }
    </div>
  )
}


export function TextOptionChainEnteredTimeColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let optionChainEnteredTime = row.cell.row.original.optionChainEnteredTime;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{optionChainEnteredTime}</div>
        : <div className="text-yellow-700">{optionChainEnteredTime}</div>
      }
    </div>
  )
}


export function TextAccountNameColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let accountName = row.cell.row.original.accountName;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{accountName}</div>
        : <div className="text-yellow-700">{accountName}</div>
      }
    </div>
  )
}

export function TextAccountUsernameColorPanel(row) {
  let optionChainStatusColor = row.cell.row.original.optionChainStatusColor;
  let accountUsername = row.cell.row.original.accountUsername;
  return (
    <div>
      {optionChainStatusColor
        ? <div>{accountUsername}</div>
        : <div className="text-yellow-700">{accountUsername}</div>
      }
    </div>
  )
}

export function ChangeOrderIndividualPanel(row) {
  const { isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual, isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual } = useContext(CopyTradingOrderContext);
  
  const { rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual } = useContext(CopyTradingOrderContext);

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
        <div onClick={orderReplaceCloseIndividual} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-yellow-300 rounded-full dark:bg-yellow-300">
        <span className="font-medium text-white dark:text-white">R</span>
        </div>
        <div onClick={orderDeleteCloseIndividual} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-middleGreen rounded-full dark:bg-middleGreen">
          <span className="font-medium text-white dark:text-white">C</span>
        </div>
      </div>
      <Overlay isOpen={isOpenOrderReplaceIndividual} >
        <TradingStockReplaceOrderIndividual rowCopyTradingOrderIndividual={rowCopyTradingOrderIndividual} onClose={orderReplaceCloseIndividual}></TradingStockReplaceOrderIndividual>
      </Overlay>
      <Overlay isOpen={isOpenOrderDeleteIndividual} >
        <TradingStockDeleteOrderIndividual rowCopyTradingOrderIndividual={rowCopyTradingOrderIndividual} onClose={orderDeleteCloseIndividual}></TradingStockDeleteOrderIndividual>
      </Overlay>
    </div>
  );
};

function CopyTradingAllAccountOrderTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default CopyTradingAllAccountOrderTable;