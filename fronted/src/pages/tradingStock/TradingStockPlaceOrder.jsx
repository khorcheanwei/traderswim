import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import Autocomplete from './Autocomplete';


export default function TradingStockPlceOrder({ onClose }) {

    var optionChainInstructionList = ["BUY_TO_OPEN", "SELL_TO_CLOSE"];
    var optionChainCallPutList = ["CALL", "PUT"];
    var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingOrderContext);

    const [stockName, setStockName] = useState("");
    const [optionChainCallPut, setOptionChainCallPut] = useState("CALL");
    const [optionChainSymbol, setOptionChainSymbol]= useState("");

    const [optionChainData, setOptionChainData] = useState([]);
    const [optionChainDateList, setOptionChainDateList] = useState([]);
    const [optionChainDate, setOptionChainDate] = useState("None");
    const [optionChainStrikeList, setOptionChainStrikeList] = useState([]);
    const [optionChainDescription, setOptionChainDescription] = useState("None");

    const [optionChainInstruction, setOptionChainInstruction] = useState(optionChainInstructionList[0]);
    const [optionChainOrderType, setOptionChainOrderType] = useState("LIMIT");
    const [optionChainQuantity, setOptionContractTotal] = useState(0)
    const [optionChainPrice, setOptionChainPrice] = useState(0)
    const [disabledButton, setDisabledButton] = useState(false)

    async function handlePlaceOrder() {
        try {
            setDisabledButton(true)
            const { data } = await axios.post("/copy_trading_account/place_order/", { optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice })

            if (data != "success") {
                alert("Copy trading failed");
            } else {
                alert("Copy trading successful");
                setIsOpenTradingStock(!isOpenTradingStock)
            }
            setDisabledButton(false)
        } catch (error) {
            alert("Copy trading failed")
            console.log(error.message);
        }
        setDisabledButton(false)
    }

    function getRevertOptionChainRealDate(currentRevertOptionChainDate) {
        if (currentRevertOptionChainDate == "None") {
            return "None"
        }

        let currentDate = currentRevertOptionChainDate.split(" ")[0];
        let currentTradeDay = currentRevertOptionChainDate.split(" ")[1];

        let currentDateList = currentDate.split("-");
        let currentDay = currentDateList[0];
        let currentMonth = currentDateList[1];
        let currentYear = currentDateList[2];

        currentTradeDay = currentTradeDay.split("(")[1];
        currentTradeDay = currentTradeDay.split(")")[0];

        return currentYear+"-"+currentMonth+"-"+currentDay+":"+currentTradeDay;
    }

    function getOptionChainRealDate(currentOptionChainDate) {

        if (currentOptionChainDate == "None") {
            return "None"
        }
        let currentDate = currentOptionChainDate.split(":")[0];
        let currentTradeDay = currentOptionChainDate.split(":")[1];

        let currentDateList = currentDate.split("-");
        let currentYear = currentDateList[0];
        let currentMonth = currentDateList[1];
        let currentDay = currentDateList[2];

        return currentDay+"-"+currentMonth+"-"+currentYear + " (" + currentTradeDay + ")";
    }

    async function getOptionChainList() {
        try {
            setOptionChainDateList([]);
            setOptionChainStrikeList([]);
            setOptionChainDescription("None");
            setOptionChainPrice(0);
            const { data } = await axios.get("/copy_trading_account/get_option_chain_list/", { params: { stockName, optionChainCallPut } })
            
            setOptionChainData(data)

            // set first option chain data when user get new option chain list
            const firstOptionChainDate = Object.keys(data)[0];
            const firstOptionChainStrikeList = Object.keys(data[firstOptionChainDate]);
            const firstOptionChainDescription = data[firstOptionChainDate][firstOptionChainStrikeList[0]][0]["description"];
            const firstOptionChainSymbol = data[firstOptionChainDate][firstOptionChainStrikeList[0]][0]["symbol"];
            const firstOptionChainBid = data[firstOptionChainDate][firstOptionChainStrikeList[0]][0]["bid"];
            
            setOptionChainDate(firstOptionChainDate);
            setOptionChainDateList(Object.keys(data))
            setOptionChainStrikeList(firstOptionChainStrikeList);
            setOptionChainDescription(firstOptionChainDescription);

            setOptionChainSymbol(firstOptionChainSymbol);
            setOptionChainPrice(firstOptionChainBid);

        } catch (error) {
            console.log(error.message);
        }
    }

    async function getOptionChainStrikeList(option_chain_date) {
        try {

            const firstOptionChainStrikeList = Object.keys(optionChainData[option_chain_date]);
            const firstOptionChainDescription = optionChainData[option_chain_date][firstOptionChainStrikeList[0]][0]["description"];
            const firstOptionChainSymbol = optionChainData[option_chain_date][firstOptionChainStrikeList[0]][0]["symbol"];
            const firstOptionChainBid = optionChainData[option_chain_date][firstOptionChainStrikeList[0]][0]["bid"];

            setOptionChainDate(option_chain_date);

            setOptionChainStrikeList(firstOptionChainStrikeList);
            setOptionChainDescription(firstOptionChainDescription);

            setOptionChainSymbol(firstOptionChainSymbol);
            setOptionChainPrice(firstOptionChainBid);

        } catch (error) {
            console.log(error.message);
        }
    }

    async function getOptionChainBidPrice(option_chain_strike) {
        try {
            setOptionChainDescription(optionChainData[optionChainDate][option_chain_strike][0]["description"]);
            setOptionChainPrice(optionChainData[optionChainDate][option_chain_strike][0]["bid"]);
            setOptionChainSymbol(optionChainData[optionChainDate][option_chain_strike][0]["symbol"]);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Option Place Order</h1>
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
                    <div className="grid items-end gap-6 mb-6 grid-cols-2">
                        <div className="relative">
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
                        </div>
                        <div className="relative">
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                value={optionChainCallPut}
                                onChange={event => setOptionChainCallPut(event.target.value)}>
                                {
                                    optionChainCallPutList.map((option_chain_call_put, index) => (
                                        <option key={index}>{option_chain_call_put}</option>
                                    ))
                                }
                            </select>
                            <label
                                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                htmlFor="small_outlined">
                                CALL/PUT:
                            </label>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                        onClick={getOptionChainList}
                        disabled={disabledButton}>
                        Get option list
                    </button>
                </div>
                <div className="relative">
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={getOptionChainRealDate(optionChainDate)}
                        onChange={event => { getOptionChainStrikeList(getRevertOptionChainRealDate(event.target.value))}}
                        >
                        {
                            optionChainDateList.map((option_chain_date, index) => (
                                <option key={index}>{getOptionChainRealDate(option_chain_date)}</option>
                            ))
                        }
                    </select>
                    <label
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                        htmlFor="small_outlined">
                        Option Chain date list:
                    </label>
                </div>
                <div className="relative">
                    {/* <Autocomplete items={optionChainStrikeList} /> */}
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        onChange={event => getOptionChainBidPrice(event.target.value)}>
                        {
                            optionChainStrikeList.map((option_chain_strike, index) => (
                                <option key={index}>{option_chain_strike}</option>
                            ))
                        }
                    </select>
                    <label
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                        htmlFor="small_outlined">
                        Option Chain strike price:
                    </label>
                </div>
                <div className="relative">
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                       {optionChainDescription}
                    </div>
                    <label
                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                        htmlFor="small_outlined">
                        Option Chain Description:
                    </label>
                </div>
                <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                    <div className="relative">
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={optionChainInstruction}
                            onChange={event => setOptionChainInstruction(event.target.value)}>
                            {
                                optionChainInstructionList.map((option_chain_instruction, index) => (
                                    <option key={index}>{option_chain_instruction}</option>
                                ))
                            }
                        </select>
                        <label
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Option Chain instruction:
                        </label>
                    </div>
                    <div className="relative">
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={optionChainOrderType}
                            onChange={event => setOptionChainOrderType(event.target.value)}>
                            {
                                optionChainOrderTypeList.map((option_chain_order_type, index) => (
                                    <option key={index}>{option_chain_order_type}</option>
                                ))
                            }
                        </select>
                        <label
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Option Chain order type:
                        </label>
                    </div>
                </div>
                <div className="grid items-end gap-6 mb-6 grid-cols-2">
                    <div className="relative">
                        <input
                            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            type="text"
                            onChange={event => setOptionContractTotal(event.target.value)}
                            value={optionChainQuantity}
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
                            onChange={event => setOptionChainPrice(event.target.value)}
                            value={optionChainPrice}
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