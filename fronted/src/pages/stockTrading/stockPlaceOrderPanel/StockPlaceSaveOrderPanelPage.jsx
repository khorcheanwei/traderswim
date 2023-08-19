import React from 'react'
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { StockPlaceOrderPanelContext } from '../context/StockPlaceOrderPanelContext';
import StockPlaceSaveOrderPanelTable, {SettingsPanel} from './StockPlaceSaveOrderPanelTable';
import {StockPlaceOrderPanel} from './StockPlaceOrderPanel';

export default function StockPlaceSaveOrderPanelPage() {
  const { stockSaveOrderList, setStockSaveOrderList } = useContext(StockPlaceOrderPanelContext);

  let columns_list;
  columns_list = [
    {
      Header: 'Place order',
      accessor: 'PlaceOrder',
      Cell: (row) => <StockPlaceOrderPanel row={row}/>,
    },
    {
      Header: 'Stock symbol',
      accessor: 'stockSymbol',
    },
    {
      Header: 'Settings',
      accessor: 'name',
      Cell: (row) => <SettingsPanel row={row} setStockSaveOrderList={setStockSaveOrderList}/>,
    },
  ]

  const columns = React.useMemo(() => columns_list, [])
  
  let stockPlaceSaveOrderPanelData = [];

  for (let index = 0; index < stockSaveOrderList.length; index++) {
    stockPlaceSaveOrderPanelData.push(stockSaveOrderList[index]);
  }

  stockPlaceSaveOrderPanelData.sort((a, b) => a.stockSymbol.localeCompare(b.stockSymbol));
  var data = React.useMemo(() => stockPlaceSaveOrderPanelData, [stockPlaceSaveOrderPanelData])

  async function stock_contract_save_order_list_fetch() {
    try {
        const {data} = await axios.get("/stock_save_order/get_stock_save_order_list"); 
        setStockSaveOrderList(data.list);

    } catch(error) {
          console.log(error.message);
    }
  }

  useEffect( () => {
    stock_contract_save_order_list_fetch();
  }, []);

  return (
    <StockPlaceSaveOrderPanelTable columns={columns} data={data} />
  );
}