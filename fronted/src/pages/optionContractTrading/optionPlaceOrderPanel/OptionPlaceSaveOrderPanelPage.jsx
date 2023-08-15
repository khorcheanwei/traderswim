import React from 'react'
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { OptionPlaceOrderPanelContext } from '../context/OptionPlaceOrderPanelContext';
import OptionPlaceSaveOrderPanelTable, {SettingsPanel} from './OptionPlaceSaveOrderPanelTable';
import {PlaceOrderPanel} from './PlaceOrderPanel';

export default function OptionPlaceSaveOrderPanelPage({callOption}) {
  const { optionContractSaveOrderList, setOptionContractSaveOrderList } = useContext(OptionPlaceOrderPanelContext);

  let columns_list;
  columns_list = [
    {
      Header: 'Place order',
      accessor: 'PlaceOrder',
      Cell: (row) => <PlaceOrderPanel row={row} callOption={callOption}/>,
    },
    {
      Header: 'Symbol description',
      accessor: 'optionChainDescription',
    },
    {
      Header: 'Settings',
      accessor: 'name',
      Cell: (row) => <SettingsPanel row={row} setOptionContractSaveOrderList={setOptionContractSaveOrderList}/>,
    },
  ]

  const columns = React.useMemo(() => columns_list, [])
  
  let optionPlaceSaveOrderPanelData = [];
  let optionChainSymbolSet = new Set();

  for (let index = 0; index < optionContractSaveOrderList.length; index++) {
    let optionChainSymbol = optionContractSaveOrderList[index]["optionChainSymbol"];
    let optionChainInstruction = optionContractSaveOrderList[index]["optionChainInstruction"];
    let optionChainDescription = optionContractSaveOrderList[index]["optionChainDescription"];

    if (!optionChainSymbolSet.has(optionChainSymbol) && optionChainInstruction == "BUY_TO_OPEN"){
      if (callOption && optionChainDescription.includes("Call")) {
        optionPlaceSaveOrderPanelData.push(optionContractSaveOrderList[index]);
        optionChainSymbolSet.add(optionChainSymbol);
      } 
      if(!callOption && optionChainDescription.includes("Put")){
        optionPlaceSaveOrderPanelData.push(optionContractSaveOrderList[index]);
        optionChainSymbolSet.add(optionChainSymbol);
      }
    }
  }

  optionPlaceSaveOrderPanelData.sort((a, b) => a.optionChainSymbol.localeCompare(b.optionChainSymbol));
  var data = React.useMemo(() => optionPlaceSaveOrderPanelData, [optionPlaceSaveOrderPanelData])

  async function option_contract_save_order_list_fetch() {
    try {
        const {data} = await axios.get("/option_contract_save_order/get_option_contract_save_order_list"); 
        setOptionContractSaveOrderList(data.list);

    } catch(error) {
          console.log(error.message);
    }
  }

  useEffect( () => {
      option_contract_save_order_list_fetch();
  }, []);

  return (
    <OptionPlaceSaveOrderPanelTable columns={columns} data={data} />
  );
}