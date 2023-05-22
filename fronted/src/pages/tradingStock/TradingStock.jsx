import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import useWebSocket from 'react-use-websocket';
import TradingStockList from './TradingStockList';
import TradingStockPrice from './TradingStockPrice';


export default function TradingStock({ onClose }) {

    var stockTradeActionList = ["BUY", "SELL"];
    var stockTradeTypeList = ["Limit", "Market"];

    const { isOpenTradingStock, setIsOpenTradingStock, setIsCopyTradingAccountSuccessful } = useContext(CopyTradingAccountContext);

    const [stockName, setStockName] = useState("");
    const [stockTradeAction, setStockTradeAction] = useState(stockTradeActionList[0]);
    const [stockTradeType, setStockTradeType] = useState("LIMIT");
    const [stockSharesTotal, setStockSharesTotal] = useState(0)
    const [stockEntryPrice, setStockEntryPrice] = useState(0)
    const [disabledButton, setDisabledButton] = useState(false)

    async function handlePlaceOrder() {
        try {
            setDisabledButton(true)
            const { data } = await axios.post("http://localhost:4000/copy_trading_account/place_order/", { stockName, stockTradeAction, stockTradeType, stockSharesTotal, stockEntryPrice })

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
    

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Trade Stock</h1>
            </div>
            <TradingStockPrice></TradingStockPrice>
            <div>
                <TradingStockList></TradingStockList>
                <div className="relative w-full lg:max-w-sm mb-6">
                    
                    {/*<select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={event => setStockName(event.target.value)}>
                        {
                            stockNameList.map((stockName, index) => (
                                <FixedSizeList key={index}>{stockName}</FixedSizeList>
                            ))
                        }
                    </select> */}
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