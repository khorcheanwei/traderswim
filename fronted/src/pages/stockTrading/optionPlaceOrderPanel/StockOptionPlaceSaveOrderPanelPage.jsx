import React from 'react'
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { StockPlaceOrderPanelContext } from '../context/StockPlaceOrderPanelContext';
import StockOptionPlaceSaveOrderPanelTable, {SettingsPanel} from './StockOptionPlaceSaveOrderPanelTable';
import {StockPlaceOrderPanel} from './StockPlaceOrderPanel';

export default function StockOptionPlaceSaveOrderPanelPage({callOption}) {
  const { stockSaveOrderList, setStockSaveOrderList } = useContext(StockPlaceOrderPanelContext);

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
    },
    {
      Header: 'Settings',
      accessor: 'name',
      Cell: (row) => <SettingsPanel row={row} setStockSaveOrderList={setStockSaveOrderList}/>,
    },
  ]

  const columns = React.useMemo(() => columns_list, [])
  
  let optionPlaceSaveOrderPanelData = [];
  let optionChainSymbolSet = new Set();

  for (let index = 0; index < stockSaveOrderList.length; index++) {
    let optionChainSymbol = stockSaveOrderList[index]["optionChainSymbol"];
    let optionChainInstruction = stockSaveOrderList[index]["optionChainInstruction"];
    let optionChainDescription = stockSaveOrderList[index]["optionChainDescription"];

    if (!optionChainSymbolSet.has(optionChainSymbol) && optionChainInstruction == "BUY_TO_OPEN"){
      if (callOption && optionChainDescription.includes("Call")) {
        optionPlaceSaveOrderPanelData.push(stockSaveOrderList[index]);
        optionChainSymbolSet.add(optionChainSymbol);
      } 
      if(!callOption && optionChainDescription.includes("Put")){
        optionPlaceSaveOrderPanelData.push(stockSaveOrderList[index]);
        optionChainSymbolSet.add(optionChainSymbol);
      }
    }
  }

  optionPlaceSaveOrderPanelData.sort((a, b) => a.optionChainSymbol.localeCompare(b.optionChainSymbol));
  var data = React.useMemo(() => optionPlaceSaveOrderPanelData, [optionPlaceSaveOrderPanelData])

  async function option_contract_save_order_list_fetch() {
    try {
        const {data} = await axios.get("/option_contract_save_order/get_option_contract_save_order_list"); 
        setStockSaveOrderList(data.list);

    } catch(error) {
          console.log(error.message);
    }
  }

  useEffect( () => {
      option_contract_save_order_list_fetch();
  }, []);

  return (
    <StockOptionPlaceSaveOrderPanelTable columns={columns} data={data} />
  );
}