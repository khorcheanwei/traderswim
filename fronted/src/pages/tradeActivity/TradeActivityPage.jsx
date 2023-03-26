
import axios from 'axios';
import React from 'react'
import {useContext, useState, useEffect} from 'react';
import { async } from 'regenerator-runtime';
import TradingActivityAdd from './TradeActivityAdd';
import { AccountContext } from './../context/AccountContext';
import  TradingActivityTable   from './TradeActivityTable'
import {SettingsPanel} from './TradeActivityTable' 


const getData = () => {
    const data = [
      {
        accountName: 'Jane Cooper',
        position: 'TSLA/USD',
        leverage: '1x Long',
        entryPrice: '13 USD',
        orderQuantity: '11',
        filledQuantity: '10',
        orderDate: '11-May-2020'
      },
      {
        accountName: 'Cody Fisher',
        position: 'TSLA/USD',
        leverage: '1x Long',
        entryPrice: '12 USD',
        orderQuantity: '10',
        filledQuantity: '9',
        orderDate: '11-Jan-2020'
      },
      {
        accountName: 'Esther Howard',
        position: 'TSLA/USD',
        leverage: '1x Long',
        entryPrice: '11 USD',
        orderQuantity: '13',
        filledQuantity: '9',
        orderDate: '11-June-2020'
      }
    ]
    return [...data]
  }

export default function TradeActivityPage() {
   
    const columns = React.useMemo(() => [
        {
          Header: "Account Name",
          accessor: 'accountName',
        },
        {
          Header: "Position",
          accessor: 'position',
        },
        {
          Header: "Leverage",
          accessor: 'leverage',
        },
        {
          Header: "Entry price",
          accessor: 'entryPrice',
        },
        {
          Header: "Order Quantity",
          accessor: 'orderQuantity',
        },
        {
          Header: "Filled Quantity",
          accessor: 'filledQuantity',
        },
        {
          Header: "Order date",
          accessor: 'orderDate',
        }, 
        {
            Header: "Place new order",
            accessor: 'placeNewOrder',
            Cell: SettingsPanel,
        }, 
      ], [])
    

      /*

      const { accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful} = useContext(AccountContext);
      

      async function fetchAccountData() {
        try {
          const response = await axios.get("/trading_account/database")
          if (response.data != null) {
            setAccountTableData(response.data)
          }
        } catch (error) {
          console.error(error);
        }
      }

      useEffect(() => {
        fetchAccountData();
      }, []) 

      if (isAccountLoginSuccessful) {
        fetchAccountData();
      } */
      
      var data = React.useMemo(() => getData(), [getData()])


      return (
        <div className="min-h-screen bg-gray-100 text-black">
          <main className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mt-6">
              <TradingActivityTable columns={columns} data={data} />
            </div>
          </main>
        </div>
      );
}

