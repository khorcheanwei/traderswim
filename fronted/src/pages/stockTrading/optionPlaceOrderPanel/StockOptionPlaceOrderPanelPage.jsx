import React from 'react'
import { useContext } from 'react';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import StockOptionPlaceOrderPanelTable from './StockOptionPlaceOrderPanelTable';
import {StockPlaceOrderPanel} from './StockPlaceOrderPanel';

export default function StockOptionPlaceOrderPanelPage({callOption}) {
  const {copyTradingOrderMainData, setCopyTradingOrderMainData} = useContext(CopyTradingOrderContext);

  let columns_list;
  
  columns_list = [
    {
      Header: 'Place order',
      accessor: 'PlaceOrder',
      Cell: (row) => <StockPlaceOrderPanel row={row} callOption={callOption}/>,
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    }
  ]
  
  const columns = React.useMemo(() => columns_list, [])
  
  let optionPlaceOrderPanelData = [];
  let optionChainSymbolSet = new Set();

  for (let index = 0; index < copyTradingOrderMainData.length; index++) {
    let optionChainSymbol = copyTradingOrderMainData[index]["optionChainSymbol"];
    let optionChainInstruction = copyTradingOrderMainData[index]["optionChainInstruction"];
    let optionChainDescription = copyTradingOrderMainData[index]["optionChainDescription"];

    if (!optionChainSymbolSet.has(optionChainSymbol) && optionChainInstruction == "BUY_TO_OPEN"){
      if (callOption && optionChainDescription.includes("Call")) {
        optionPlaceOrderPanelData.push(copyTradingOrderMainData[index]);
        optionChainSymbolSet.add(optionChainSymbol);
      } 
      if(!callOption && optionChainDescription.includes("Put")){
        optionPlaceOrderPanelData.push(copyTradingOrderMainData[index]);
        optionChainSymbolSet.add(optionChainSymbol);
      }
    }
  }

  optionPlaceOrderPanelData.sort((a, b) => a.optionChainSymbol.localeCompare(b.optionChainSymbol));
  var data = React.useMemo(() => optionPlaceOrderPanelData, [optionPlaceOrderPanelData])
  
  return (
    <StockOptionPlaceOrderPanelTable columns={columns} data={data} />
  );
}