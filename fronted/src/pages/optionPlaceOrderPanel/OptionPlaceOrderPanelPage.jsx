import React from 'react'
import { useContext } from 'react';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import OptionPlaceOrderPanelTable, {PlaceOrderPanel} from './OptionPlaceOrderPanelTable';

export default function OptionPlaceOrderPanelPage() {
  const {copyTradingOrderMainData, setCopyTradingOrderMainData} = useContext(CopyTradingOrderContext);

  const columns = React.useMemo(() => [
    {
      Header: 'Place order',
      accessor: 'PlaceOrder',
      Cell: PlaceOrderPanel,
    },
    {
      Header: 'Symbol',
      accessor: 'optionChainSymbol',
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
  ], [])

  let optionPlaceOrderPanelData = [];
  let optionChainSymbolSet = new Set();

  for (let index = 0; index < copyTradingOrderMainData.length; index++) {
    let optionChainSymbol = copyTradingOrderMainData[index]["optionChainSymbol"];
    let optionChainInstruction = copyTradingOrderMainData[index]["optionChainInstruction"];

    if (!optionChainSymbolSet.has(optionChainSymbol) && optionChainInstruction == "BUY_TO_OPEN"){
      optionPlaceOrderPanelData.push(copyTradingOrderMainData[index]);
    }
    optionChainSymbolSet.add(optionChainSymbol);
  }
  var data = React.useMemo(() => optionPlaceOrderPanelData, [optionPlaceOrderPanelData])

  return (
    <OptionPlaceOrderPanelTable columns={columns} data={data} />
  );
}