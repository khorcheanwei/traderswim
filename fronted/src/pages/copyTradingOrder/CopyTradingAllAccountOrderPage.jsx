import Overlay from "../Overlay";
import React from 'react'
import { useContext, useState, useEffect, useRef  } from 'react';

import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import CopyTradingAllAccountOrderTable from './CopyTradingAllAccountOrderTable'


import TradingStockReplaceOrderSelected from '../tradingStock/TradingStockReplaceOrderSelected';
import TradingStockDeleteOrderSelected from '../tradingStock/TradingStockDeleteOrderSelected';

import { TextOptionChainDescriptionColorPanel, TextOptionChainFilledQuantityColorPanel, TextOptionChainPriceColorPanel, TextOptionChainQuantityColorPanel,
  TextOptionChainInstructionColorPanel, TextOptionChainStatusColorPanel, TextOptionChainOrderTypeColorPanel, TextOptionChainEnteredTimeColorPanel,
  TextAccountNameColorPanel,TextAccountUsernameColorPanel, ChangeOrderIndividualPanel, MakeSelectedOrderPanel} from './CopyTradingAllAccountOrderTable'

export default function CopyTradingAllAccountOrderPage({ rowCopyTradingOrder, onClose }) {

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
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Change order',
      accessor: 'ChangeOrder',
      Cell: ChangeOrderIndividualPanel,
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
      Cell: TextOptionChainDescriptionColorPanel,
    },
    {
      Header: 'Option chain order Id',
      accessor: 'optionChainOrderId',
    },
    {
      Header: 'Filled Qty',
      accessor: 'optionChainFilledQuantity',
      Cell: TextOptionChainFilledQuantityColorPanel,
    },
    {
      Header: 'Price',
      accessor: 'optionChainPrice',
      Cell: TextOptionChainPriceColorPanel,
    },
    {
      Header: 'Qty',
      accessor: 'optionChainQuantity',
      Cell: TextOptionChainQuantityColorPanel,
    },
    {
      Header: 'Side Pos Effect',
      accessor: 'optionChainInstruction',
      Cell: TextOptionChainInstructionColorPanel,
    },
    {
      Header: 'Status',
      accessor: 'optionChainStatus',
      Cell: TextOptionChainStatusColorPanel,
    },
    {
      Header: 'Order type',
      accessor: 'optionChainOrderType',
      Cell: TextOptionChainOrderTypeColorPanel,
    },
    {
      Header: 'Time',
      accessor: 'optionChainEnteredTime',
      Cell: TextOptionChainEnteredTimeColorPanel,
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
  
  const {copyTradingOrderDataDict, setCopyTradingOrderDataDict} = useContext(CopyTradingOrderContext);
  const copyTradingAllAccountData = copyTradingOrderDataDict[agentTradingSessionID];
  var data = React.useMemo(() => copyTradingAllAccountData, [copyTradingAllAccountData])

  // replace and cancel selected orders
  const { isOpenOrderReplaceSelected, setIsOpenOrderReplaceSelected, isOpenOrderDeleteSelected, setIsOpenOrderDeleteSelected } = useContext(CopyTradingOrderContext);
  
  //const { rowCopyTradingOrderSelected, setRowCopyTradingOrderSelected } = useContext(CopyTradingOrderContext);

  console.log(selectedOrderDict)

  const orderReplaceCloseSelected = async () => {
    console.log(copyTradingAllAccountData)
    setIsOpenOrderReplaceSelected(!isOpenOrderReplaceSelected)
  }

  const orderDeleteCloseSelected = async () => {
    setIsOpenOrderDeleteSelected(!isOpenOrderDeleteSelected)
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
            <div onClick={orderReplaceCloseSelected} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-yellow-300 rounded-full dark:bg-yellow-300">
              <span className="font-medium text-white dark:text-white">R</span>
            </div>
            <div onClick={orderDeleteCloseSelected} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-middleGreen rounded-full dark:bg-middleGreen">
              <span className="font-medium text-white dark:text-white">C</span>
            </div>
          </div>
          <Overlay isOpen={isOpenOrderReplaceSelected} >
            <TradingStockReplaceOrderSelected selectedOrderDict={selectedOrderDict} onClose={orderReplaceCloseSelected}></TradingStockReplaceOrderSelected>
          </Overlay>
          <Overlay isOpen={isOpenOrderDeleteSelected} >
            <TradingStockDeleteOrderSelected selectedOrderDict={selectedOrderDict} onClose={orderDeleteCloseSelected}></TradingStockDeleteOrderSelected>
          </Overlay>
        </div>
        <CopyTradingAllAccountOrderTable columns={columns} data={data} />
    </div>
  );
}