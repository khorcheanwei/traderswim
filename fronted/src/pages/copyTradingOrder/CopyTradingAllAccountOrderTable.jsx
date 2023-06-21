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