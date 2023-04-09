
import axios from 'axios';
import { Button, PageButton } from '../shared/Button'
import {useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import { useRef } from "react";

export default function TradingStock() {
    var stockNameList = ["TSLA", "APLA", "ADBE"];
    var stockTradeActionList = ["BUY", "SELL"];
    var stockTradeTypeList = ["Limit", "Market"];

    const { contextAgentID } = useContext(UserContext);

    const {isOpenTradingStock, setIsOpenTradingStock,setIsCopyTradingAccountSuccessful} = useContext(CopyTradingAccountContext);

    const [stockName, setStockName] = useState(stockNameList[0]);
    const [stockTradeAction, setStockTradeAction] = useState(stockTradeActionList[0]);
    const [stockTradeType, setStockTradeType] = useState("LIMIT");
    const [stockSharesTotal, setStockSharesTotal] = useState(0)
    const [stockEntryPrice, setStockEntryPrice] = useState(0)
    const [disabledButton, setDisabledButton] = useState(false)

    async function handlePlaceOrder() {
        const agentID = contextAgentID;
        try {
            setDisabledButton(true)
            const {data} = await axios.post("/copy_trading_account/place_order/", {agentID, stockName, stockTradeAction, stockTradeType, stockSharesTotal, stockEntryPrice})
            
            if (data != "success") {
                alert("Copy trading failed");
            } else {
                alert("Copy trading successful");
                console.log(isOpenTradingStock)
                setIsOpenTradingStock(!isOpenTradingStock)
                setIsCopyTradingAccountSuccessful(true)
            }
            setDisabledButton(false)

          } catch(e) {
              alert("Account deleted failed")
              console.log(e);
          }
          setDisabledButton(false)
    }

    return (
        <div>
            <div className="mb-6">Trade:</div>
            <div>
                <div className="relative w-full lg:max-w-sm mb-6">
                    <select 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={event => setStockName(event.target.value)}>
                        {
                            stockNameList.map((stockName, index) => (
                                <option key={index}>{stockName}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <select 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={event => setStockTradeAction(event.target.value)}>
                            {
                                stockTradeActionList.map((stockTradeAction, index) => (
                                    <option key={index}>{stockTradeAction}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <select 
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={event => setStockTradeType(event.target.value)}>
                            {
                                stockTradeTypeList.map((stockTradeType, index) => (
                                    <option key={index}>{stockTradeType}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="grid items-end gap-6 mb-6 grid-cols-2">
                    <div className="relative">
                        <input 
                            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                            type="text" 
                            onChange={event => setStockSharesTotal(event.target.value)}
                            value={stockSharesTotal}
                            placeholder=" " />
                        <label
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Shares:
                        </label>
                    </div>
                    <div className="relative">
                        <input className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
                            type="text" 
                            onChange={event => setStockEntryPrice(event.target.value)}
                            value={stockEntryPrice} 
                            placeholder=" " />
                        <label
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Price:
                        </label>
                    </div>
                </div>
            </div>
            <Button  disabled={disabledButton} className="text-gray-700 " onClick={handlePlaceOrder}>Place order</Button>
        </div>
    )
}