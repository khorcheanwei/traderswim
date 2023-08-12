import React from 'react'
import { useContext } from 'react';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import OptionPlaceOrderPanelTable from './OptionPlaceOrderPanelTable';
import {PlaceOrderPanel} from './PlaceOrderPanel';

export default function OptionPlaceOrderPanelPage({callOption}) {
  const {copyTradingOrderMainData, setCopyTradingOrderMainData} = useContext(CopyTradingOrderContext);

  let columns_list;
  if (callOption){
    columns_list = [
      {
        Header: 'Place order',
        accessor: 'PlaceOrder',
        Cell: (row) => <PlaceOrderPanel row={row} callOption={callOption}/>,
      },
      {
        Header: 'Symbol description',
        accessor: 'optionChainDescription',
      }
    ]
  } else{
    columns_list = [
      {
        Header: 'Symbol description',
        accessor: 'optionChainDescription',
      },
      {
        Header: 'Place order',
        accessor: 'PlaceOrder',
        Cell: (row) => <PlaceOrderPanel row={row} callOption={callOption}/>,
      }
    ]
  } 
  
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
    <OptionPlaceOrderPanelTable columns={columns} data={data} />
  );
}