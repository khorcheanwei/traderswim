import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { OptionContractPlaceOrderContext } from '../context/OptionContractPlaceOrderContext';
import { OptionPlaceOrderPanelContext } from '../context/OptionPlaceOrderPanelContext';
import AutocompleteList from './AutocompleteList';
import { ClipLoader } from 'react-spinners';


export default function TradingStockAllActivePlaceOrder({ onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    var optionChainInstructionList = ["BUY_TO_OPEN", "SELL_TO_CLOSE"];
    //var optionChainCallPutList = ["CALL", "PUT"];
    var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    const { isOpenTradingStock, setIsOpenTradingStock } = useContext(OptionContractPlaceOrderContext);
    const {optionContractSaveOrderList, setOptionContractSaveOrderList } = useContext(OptionPlaceOrderPanelContext);

    const [optionContractTickerName, setOptionContractTickerName] = useState("");
    const [isOptionChainCall, setIsOptionChainCall] = useState(false);
    const [isOptionChainPut, setIsOptionChainPut] = useState(false);
    const [optionChainCallPut, setOptionChainCallPut] = useState("");

    const [optionChainData, setOptionChainData] = useState([]);
    const [optionChainDateList, setOptionChainDateList] = useState([]);
    const [optionChainDate, setOptionChainDate] = useState("None");
    const [optionChainStrikeList, setOptionChainStrikeList] = useState([]);
    const [optionChainDescription, setOptionChainDescription] = useState("None");

    const [refreshOptionChainStrikeListKey, setRefreshOptionChainStrikeListKey] = useState(0);

    const [optionChainSymbol, setOptionChainSymbol]= useState("");
    const [optionChainInstruction, setOptionChainInstruction] = useState(optionChainInstructionList[0]);
    const [optionChainOrderType, setOptionChainOrderType] = useState("LIMIT");
    const [optionChainQuantity, setOptionChainQuantity] = useState(1)
    const [optionChainPrice, setOptionChainPrice] = useState(0)

    const [disabledButton, setDisabledButton] = useState(false)

    const [optionContractTicker, setOptionContractTicker] = useState("");
    const [optionContractTickerList, setOptionContractTickerList] = useState([]);

    const optionContractTickerListLength = optionContractTickerList.length;

    async function handlePlaceOrder() {
        setDisabledButton(true);
        try {
            const allTradingAccountsOrderList = [];
            const { data } = await axios.post("/copy_trading_account/place_order/", { allTradingAccountsOrderList, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice })

            if (data != "success") {
                alert("Copy trading failed");
            } else {
                alert("Copy trading successful");
                setIsOpenTradingStock(!isOpenTradingStock)
            }
        } catch (error) {
            alert("Copy trading failed")
            console.log(error.message);
        }
        setDisabledButton(false);
    }

    async function saveOrder() {
        setDisabledButton(true);
        try {
            if (!optionChainSymbol || !optionChainDescription || !optionChainInstruction || !optionChainOrderType || !optionChainQuantity || !optionChainPrice) {
                alert("Please ensure option contract information is completed");
                return;
            }
            const {data} = await axios.post("/option_contract_save_order/add_option_contract_save_order/", { optionChainSymbol, optionChainDescription, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice });
            if (data.success != true) {
                alert("Save order failed");
            } else {
                alert("Save order successful");
                setOptionContractSaveOrderList(data.list)
                setIsOpenTradingStock(!isOpenTradingStock);
            }
        } catch (error) {
            alert("Save order failed")
            console.log(error.message);
        }
        setDisabledButton(false);
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
            setIsLoading(true);
            setRefreshOptionChainStrikeListKey((prevKey) => prevKey + 1);

            setOptionChainDateList([]);
            setOptionChainStrikeList([]);
            setOptionChainDescription("None");
            setOptionChainPrice(0);
            const { data } = await axios.get("/copy_trading_account/get_option_chain_list/", { params: { optionContractTickerName, optionChainCallPut }, timeout: 5000})
            if (data != null) {
                setOptionChainData(data);

                // set first option chain data when user get new option chain list
                const firstOptionChainDate = Object.keys(data)[0];
                const firstOptionChainStrikeList = Object.keys(data[firstOptionChainDate]);
                const firstOptionChainDescription = data[firstOptionChainDate][firstOptionChainStrikeList[0]][0]["description"];
                const firstOptionChainSymbol = data[firstOptionChainDate][firstOptionChainStrikeList[0]][0]["symbol"];
                const firstOptionChainBid = data[firstOptionChainDate][firstOptionChainStrikeList[0]][0]["bid"];
                
                setOptionChainDate(firstOptionChainDate);
                setOptionChainDateList(Object.keys(data));
                setOptionChainStrikeList(firstOptionChainStrikeList);
                setOptionChainDescription(firstOptionChainDescription);

                setOptionChainSymbol(firstOptionChainSymbol);
                setOptionChainPrice(firstOptionChainBid);
            } else {
                if(isOptionChainCall || isOptionChainPut) {
                    alert("Failed to get option chain");
                }
                
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error.message);
            alert("Failed to get option chain");
            setIsLoading(false);
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

    async function option_contract_list_fetch() {
        try {
          const {data} = await axios.get("/option_contract/get_option_contract_list"); 
          setOptionContractTickerList(data.list);
  
        } catch(error) {
            console.log(error.message);
        }
    }

    async function handleOptionContractAdd() {
        if (!optionContractTicker) {
            alert("Please ensure option contract symbol is completed");
            return;
        }
        const isOptionContractExist = optionContractTickerList.some(currentOptionContractTicker => currentOptionContractTicker === optionContractTicker);
        if (!isOptionContractExist) {
            const response = await axios.post("/option_contract/add_option_contract/", { "optionChainSymbol": optionContractTicker })
            if (response.data.success != true) {
                alert("Add option contract failed");
            } else {
                alert("Add option contract successful");
            }

            setOptionContractTickerList( isOptionContractExist ? optionContractTickerList : [...optionContractTickerList, optionContractTicker]);
        } else {
            alert("Option contract is already existed");
        }
    };
    async function handleOptionContractRemove(currentOptionContractTicker) {
        const response = await axios.delete("/option_contract/remove_option_contract/", { data:{ "optionChainSymbol": currentOptionContractTicker }})

        if (response.data.success != true) {
            alert("Remove option contract failed");
        } else {
            setOptionContractTickerList(response.data.list);
            alert("Remove option contract successful");
        }
    }

    const handleIsOptionChainCall = async () => {
        setIsOptionChainCall(true);
        setIsOptionChainPut(false);
        setOptionChainCallPut("CALL");
    };

    const handleIsOptionChainPut = async () => {
        setIsOptionChainCall(false);
        setIsOptionChainPut(true);
        setOptionChainCallPut("PUT");
    };

    useEffect( () => {
        if ((!isOptionChainCall && isOptionChainPut) || (isOptionChainCall && !isOptionChainPut)) {
            getOptionChainList();
        }
    }, [optionChainCallPut]);

    useEffect( () => {
        option_contract_list_fetch();
    }, [optionContractTickerListLength]);

    const handleSetStockName = (currentOptionContractTicker) => {
        setOptionContractTickerName(currentOptionContractTicker)

        setIsOptionChainCall(false);
        setIsOptionChainPut(false);
        setOptionChainCallPut("");

        setOptionChainData([]);
        setOptionChainDateList([]);
        setOptionChainDate("None");
        setOptionChainStrikeList([]);
        setOptionChainDescription("None");

        setOptionChainSymbol("");
        setOptionChainInstruction(optionChainInstructionList[0]);
        setOptionChainOrderType("LIMIT");
        setOptionChainQuantity(1);
        setOptionChainPrice(0);
    }

    return (
        <div>
            {isLoading ? (
                <ClipLoader loading={true} size={50} />
            ) : (
                <div className="flex gap-10">
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="optionContractTicker">Option Contract List</label>
                                <div className="flex gap-5">
                                    <input
                                        type="text"
                                        id="optionContractTicker"
                                        value={optionContractTicker}
                                        onInput={(event) => setOptionContractTicker((event.target.value).toUpperCase())}
                                    />
                                    <button className="inline-block rounded bg-teal-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]" type="button" onClick={handleOptionContractAdd}>
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-scroll">
                                {optionContractTickerList.map((currentOptionContractTicker, index) => (
                                    <div key={index} className="option contracts">
                                        <div className="flex justify-between gap-5">
                                            <button
                                                className="inline-block rounded bg-grey-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                                onClick={() => handleSetStockName(currentOptionContractTicker)}
                                            >
                                                {currentOptionContractTicker}
                                            </button>
                                            <button
                                                className="inline-block rounded bg-red-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                                onClick={() => handleOptionContractRemove(currentOptionContractTicker)} 
                                                >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                onClick={saveOrder}
                                disabled={disabledButton}>
                                Save order
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="mb-4">
                            <h1 className="block text-gray-700 text-lm font-bold mb-2">Option Place Order On All Active Accounts</h1>
                        </div>
                        <div>
                            <div className="relative w-full lg:max-w-sm mb-6">
                                {/*<select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={event => setOptionContractTickerName(event.target.value)}>
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
                                            onChange={event => setOptionContractTickerName(event.target.value)}
                                            value={optionContractTickerName}
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
                                        onChange={event => setOptionChainQuantity(event.target.value)}
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
                </div>
            )
        }
        </div>
    )
}