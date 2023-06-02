import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import useWebSocket from 'react-use-websocket';
import TradingStockList from './TradingStockList';


export default function TradingStock({ onClose }) {

    var optionChainActionList = ["BUY_TO_OPEN", "BUY_TO_CLOSE", "SELL_TO_OPEN", "SELL_TO_CLOSE"];
    var optionChainTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    const { isOpenTradingStock, setIsOpenTradingStock, setIsCopyTradingAccountSuccessful } = useContext(CopyTradingAccountContext);

    const [stockName, setStockName] = useState("");
    const [optionChainSymbol, setOptionChainSymbol]= useState("");

    const [optionChainData, setOptionChainData] = useState([]);
    const [optionChainDateList, setOptionChainDateList] = useState([]);
    const [optionChainDate, setOptionChainDate] = useState([]);
    const [optionChainStrikeList, setOptionChainStrikeList] = useState([]);

    const [optionChainAction, setOptionChainAction] = useState(optionChainActionList[0]);
    const [optionChainType, setOptionChainType] = useState("LIMIT");
    const [optionContractTotal, setOptionContractTotal] = useState(0)
    const [optionContractPrice, setOptionContractPrice] = useState(0)
    const [disabledButton, setDisabledButton] = useState(false)

    async function handlePlaceOrder() {
        try {
            setDisabledButton(true)
            const { data } = await axios.post("/copy_trading_account/place_order/", { optionChainSymbol, optionChainAction, optionChainType, optionContractTotal, optionContractPrice })

            if (data != "success") {
                alert("Copy trading failed");
            } else {
                alert("Copy trading successful");
                setIsOpenTradingStock(!isOpenTradingStock)
                setIsCopyTradingAccountSuccessful(true)
            }
            setDisabledButton(false)
        } catch (error) {
            alert("Copy trading failed")
            console.log(error.message);
        }
        setDisabledButton(false)
    }

    async function getOptionChainList() {
        try {
            const { data } = await axios.get("/copy_trading_account/get_option_chain_list/", { params: { stockName } })
            setOptionChainData(data)
            setOptionChainDateList(Object.keys(data))
            
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getOptionChainStrikeList(option_chain_date) {
        try {
            setOptionChainDate(option_chain_date);
            setOptionChainStrikeList(Object.keys(optionChainData[option_chain_date]))
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getOptionChainBidPrice(option_chain_strike) {
        try {
            setOptionContractPrice(optionChainData[optionChainDate][option_chain_strike][0]["bid"]);
            setOptionChainSymbol(optionChainData[optionChainDate][option_chain_strike][0]["symbol"])
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Trade Stock</h1>
            </div>
            <div>
                
                <div className="relative w-full lg:max-w-sm mb-6">
                    
                    {/*<select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={event => setStockName(event.target.value)}>
                        {
                            stockNameList.map((stock_name, index) => (
                                <FixedSizeList key={index}>{stock_name}</FixedSizeList>
                            ))
                        }
                    </select> */}
                    <input
                        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        type="text"
                        onChange={event => setStockName(event.target.value)}
                        value={stockName}
                        onInput={(event) => event.target.value = (event.target.value).toUpperCase()}
                        placeholder=" " />
                    <label
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                        htmlFor="small_outlined">
                        Stock Pair:
                    </label>
                    <button
                        type="button"
                        className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                        onClick={getOptionChainList}
                        disabled={disabledButton}>
                        Get option list
                    </button>
                </div>
                <div>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={event => { getOptionChainStrikeList(event.target.value)}}>
                        {
                            optionChainDateList.map((option_chain_date, index) => (
                                <option key={index}>{option_chain_date}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={event => getOptionChainBidPrice(event.target.value)}>
                        {
                            optionChainStrikeList.map((option_chain_strike, index) => (
                                <option key={index}>{option_chain_strike}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={event => setOptionChainAction(event.target.value)}>
                            {
                                optionChainActionList.map((stock_trade_action, index) => (
                                    <option key={index}>{stock_trade_action}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={event => setOptionChainType(event.target.value)}>
                            {
                                optionChainTypeList.map((stock_trade_type, index) => (
                                    <option key={index}>{stock_trade_type}</option>
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
                            onChange={event => setOptionContractTotal(event.target.value)}
                            value={optionContractTotal}
                            placeholder=" " />
                        <label
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Option Contract Total:
                        </label>
                    </div>
                    <div className="relative">
                        <input className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            type="text"
                            onChange={event => setOptionContractPrice(event.target.value)}
                            value={optionContractPrice}
                            placeholder=" " />
                        <label
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Price:
                        </label>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-5">
                <button
                    type="button"
                    className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={onClose}>
                    CANCEL
                </button>
                <button
                    type="button"
                    className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={handlePlaceOrder}
                    disabled={disabledButton}>
                    Place order
                </button>
            </div>
        </div>
    )
}