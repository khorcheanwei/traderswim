import Overlay from "../../Overlay";
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';
import StockCopyTradingAllAccountOrderTable from './StockCopyTradingAllAccountOrderTable'

import StockReplaceOrderSelected from '../tradingStock/StockReplaceOrderSelected';
import StockDeleteOrderSelected from '../tradingStock/StockDeleteOrderSelected';

import StockWarningMessage from '../tradingStock/StockWarningMessage';

import { TextStockSymbolColorPanel, TextStockFilledQuantityColorPanel, TextStockPriceColorPanel, TextStockQuantityColorPanel,
  TextStockInstructionColorPanel, TextStockStatusColorPanel, TextStockOrderTypeColorPanel, TextStockEnteredTimeColorPanel,
  TextAccountNameColorPanel,TextAccountUsernameColorPanel, ChangeOrderIndividualPanel, MakeSelectedOrderPanel} from './StockCopyTradingAllAccountOrderTable'



export default function StockCopyTradingAllAccountOrderPage({ rowCopyTradingOrder, onClose }) {

  const [selectedOrderDict, setSelectedOrderDict] = useState({});

  const columns = React.useMemo(() => [
    {
      Header: 'ID',
      accessor: 'agentTradingSessionID',
    },
    {
      Header: 'Account Id',
      accessor: 'accountId',
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: ChangeOrderIndividualPanel,
    },
    {
      Header: 'Symbol',
      accessor: 'stockSymbol',
      Cell: TextStockSymbolColorPanel,
    },
    {
      Header: 'Stock order Id',
      accessor: 'stockOrderId',
    },
    {
      Header: 'Filled Qty',
      accessor: 'stockFilledQuantity',
      Cell: TextStockFilledQuantityColorPanel,
    },
    {
      Header: 'Price',
      accessor: 'stockPrice',
      Cell: TextStockPriceColorPanel,
    },
    {
      Header: 'Qty',
      accessor: 'stockQuantity',
      Cell: TextStockQuantityColorPanel,
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'stockInstruction',
      Cell: TextStockInstructionColorPanel,
    },
    {
      Header: 'Status',
      accessor: 'stockStatus',
      Cell: TextStockStatusColorPanel,
    },
    {
      Header: 'Order type',
      accessor: 'stockOrderType',
      Cell: TextStockOrderTypeColorPanel,
    },
    {
      Header: 'Time',
      accessor: 'stockEnteredTime',
      Cell: TextStockEnteredTimeColorPanel,
    },
    {
      Header: 'Name',
      accessor: 'accountName',
      Cell: TextAccountNameColorPanel,
    },
    {
      Header: 'Account Username',
      accessor: 'accountUsername',
      Cell: TextAccountUsernameColorPanel,
    },
    {
      Header: 'SELECTED ORDER',
      accessor: 'makeSelectedOrder',
      Cell: (row) => <MakeSelectedOrderPanel row={row} setSelectedOrderDict={setSelectedOrderDict}/>,
    }
  ], [])

  const agentTradingSessionID = rowCopyTradingOrder.row.original.agentTradingSessionID;
  
  const {stockCopyTradingOrderDataDict, setStockCopyTradingOrderDataDict} = useContext(StockCopyTradingOrderContext);
  const copyTradingAllAccountData = stockCopyTradingOrderDataDict[agentTradingSessionID];
  var data = React.useMemo(() => copyTradingAllAccountData, [copyTradingAllAccountData]);

  // replace and cancel selected orders
  const { isOpenOrderReplaceSelected, setIsOpenOrderReplaceSelected, isOpenOrderDeleteSelected, setIsOpenOrderDeleteSelected, isOpenWarningMessageOrderSelected, setIsOpenWarningMessageOrderSelected } = useContext(StockCopyTradingOrderContext);
  
  const warningMessageOrderSelectedClose = async () => {
    setIsOpenWarningMessageOrderSelected(!isOpenWarningMessageOrderSelected);
  }

  const orderReplaceSelectedClose = async () => {
    if (Object.keys(selectedOrderDict).length == 0) {
      warningMessageOrderSelectedClose();
    } else {
      setIsOpenOrderReplaceSelected(!isOpenOrderReplaceSelected);
    }
  }

  const orderDeleteSelectedClose = async () => {
    if (Object.keys(selectedOrderDict).length == 0) {
      warningMessageOrderSelectedClose();
    } else {
      setIsOpenOrderDeleteSelected(!isOpenOrderDeleteSelected);
    }
  }

  return (
    <div>
        <div className="flex justify-between">
          <button
              type="button"
              className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
              onClick={onClose}>
              CANCEL
          </button>
          <div className="flex space-x-2 mr-10">
            <div onClick={orderReplaceSelectedClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-yellow-300">
              <span className="font-medium text-white dark:text-white">R</span>
            </div>
            <div onClick={orderDeleteSelectedClose} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-middleGreen">
              <span className="font-medium text-white dark:text-white">C</span>
            </div>
          </div>
        </div>
        <div>
          <Overlay isOpen={isOpenWarningMessageOrderSelected} >
            <StockWarningMessage warningMessage={"Please select at least one order!"} onClose={warningMessageOrderSelectedClose}></StockWarningMessage>
          </Overlay>
          <Overlay isOpen={isOpenOrderReplaceSelected} >
            <StockReplaceOrderSelected rowCopyTradingOrderSelected={rowCopyTradingOrder} selectedOrderDict={selectedOrderDict} onClose={orderReplaceSelectedClose}></StockReplaceOrderSelected>
          </Overlay>
          <Overlay isOpen={isOpenOrderDeleteSelected} >
            <StockDeleteOrderSelected rowCopyTradingOrderSelected={rowCopyTradingOrder} selectedOrderDict={selectedOrderDict} onClose={orderDeleteSelectedClose}></StockDeleteOrderSelected>
          </Overlay>
        </div>
        <StockCopyTradingAllAccountOrderTable columns={columns} data={data} />
    </div>
  );
}