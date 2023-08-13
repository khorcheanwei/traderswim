import axios from 'axios';
import { useState} from 'react';
import { OptionContractPlaceOrderContextProvider, useOptionContractPlaceOrderContext } from '../../context/OptionContractPlaceOrderContext';
import AutocompleteList from './../AutocompleteList';

export default function TradingStockAllActivePlaceOrder({ allActivePlaceOrderClose }) {
    var optionChainInstructionList = ["BUY_TO_OPEN", "SELL_TO_CLOSE"];
    //var optionChainCallPutList = ["CALL", "PUT"];
    var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    const { isLoading, stockName, isOptionChainCall, isOptionChainPut, optionChainData, 
        optionChainDateList, optionChainDate, optionChainStrikeList, optionChainDescription, refreshOptionChainStrikeListKey, 
        optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice, 
        optionContractTicker, optionContractTickerList, dispatch } = useOptionContractPlaceOrderContext();

    const [disabledButton, setDisabledButton] = useState(false)

    async function handlePlaceOrder() {
        setDisabledButton(true);
        try {
            const allTradingAccountsOrderList = [];
            const { data } = await axios.post("/copy_trading_account/place_order/", { allTradingAccountsOrderList, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice });
            if (data != "success") {
                alert("Copy trading failed");
            } else {
                alert("Copy trading successful");
                allActivePlaceOrderClose();
            }
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

    async function getOptionChainList(optionChainCallPut) {
        try {
            dispatch({type: "getBeforeOptionChainList"}); 
            const { data } = await axios.get("/copy_trading_account/get_option_chain_list/", { params: { stockName, optionChainCallPut }, timeout: 5000});
            if (data != null) {
                dispatch({type: "getAfterOptionChainList", payload: data}); 
            } else {
                if(isOptionChainCall || isOptionChainPut) {
                    alert("Failed to get option chain");
                }             
            }
        } catch (error) {
            console.log(error.message);
            alert("Failed to get option chain");
        }
        dispatch({type : "setIsLoadingFalse"});
    }
    async function getOptionChainStrikeList(option_chain_date) {
        try {
            dispatch({type: "getOptionChainStrikeList", payload: option_chain_date}); 
        } catch (error) {
            console.log(error.message);
        }
    }

    async function getOptionChainBidPrice(option_chain_strike) {
        try {
            dispatch({type: "getOptionChainBidPrice", payload: option_chain_strike}); 
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleIsOptionChainCall = async () => {
        if (!isOptionChainCall && !isOptionChainPut) {
            dispatch({type: "handleIsOptionChainCall"});
            getOptionChainList("CALL");
        }

        if (!isOptionChainCall) {
            dispatch({type: "handleIsOptionChainCall"});
            getOptionChainList("CALL");
        }
        
    };

    const handleIsOptionChainPut = async () => {
        if (!isOptionChainCall && !isOptionChainPut) {
            dispatch({type: "handleIsOptionChainPut"});
            getOptionChainList("PUT");
        }

        if (!isOptionChainPut) {
            dispatch({type: "handleIsOptionChainPut"}); 
            getOptionChainList("PUT");
        } 
    };

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Option Place Order On All Active Accounts</h1>
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
                    </select>*/}
                    <div className="grid items-end gap-6 mb-6 grid-cols-2">
                        <div className="relative">
                            <input
                                className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                type="text"  
                                onChange={event => dispatch({type: "setStockName", payload: event.target.value})}
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
                        <div className="flex justify-start gap-5">
                            <label>
                                CALL
                                <br />
                                <input
                                    className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    type="checkbox"
                                    checked={isOptionChainCall}
                                    onChange={handleIsOptionChainCall}
                                />
                            </label>
                            <label>
                                PUT
                                <br />
                                <input
                                    className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    type="checkbox"
                                    checked={isOptionChainPut}
                                    onChange={handleIsOptionChainPut}
                                />
                            </label>
                            </div>
                            {/*<select
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
                            </label> */}
                        </div>
                    </div>
                    {/*<button
                        type="button"
                        className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                        onClick={getOptionChainList}
                        disabled={disabledButton}>
                        Get option list
                        </button> */}
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
                    <AutocompleteList key={refreshOptionChainStrikeListKey} list={optionChainStrikeList} onData={getOptionChainBidPrice}></AutocompleteList>
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
                            onChange={event => dispatch({type: "setOptionChainInstruction", payload:event.target.value})}>
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
                            onChange={event => dispatch({type: "setOptionChainOrderType", payload: event.target.value})}>
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
                            onChange={event => dispatch({type: "setOptionChainQuantity", payload: event.target.value})}
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
                            onChange={event => dispatch({type: "setOptionChainPrice", payload: event.target.value})}
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
                    onClick={allActivePlaceOrderClose}>
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
};