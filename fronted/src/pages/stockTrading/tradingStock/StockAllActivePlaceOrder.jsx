import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { StockPlaceOrderContext } from '../context/StockPlaceOrderContext';
import { StockPlaceOrderPanelContext } from '../context/StockPlaceOrderPanelContext';
import { ClipLoader } from 'react-spinners';


export default function StockAllActivePlaceOrder({ onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stopPriceLinkTypeDict = {"$ Dollars": "VALUE", "% Percent": "PERCENT" }

    const { isOpenTradingStock, setIsOpenTradingStock } = useContext(StockPlaceOrderContext);
    const { stockSaveOrderList, setStockSaveOrderList } = useContext(StockPlaceOrderPanelContext);

    const [stockSymbol, setStockSymbol]= useState("");
    const [stockInstruction, setStockInstruction] = useState(stockInstructionList[0]);
    const [stockSessionDuration, setStockSessionDuration] = useState("DAY");
    const [stockOrderType, setStockOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(1);

    const [stockPrice, setStockPrice] = useState(0);
    const [stockStopPrice, setStockStopPrice] = useState(0);
    const [stockStopPriceLinkTypeSymbol, setStockStopPriceLinkTypeSymbol] = useState("$ Dollars")
    const [stockStopPriceOffset, setStockStopPriceOffset] = useState(0.1);

    const [disabledButton, setDisabledButton] = useState(false)

    const [stockTicker, setStockTicker] = useState("");
    const [stockTickerList, setStockTickerList] = useState([]);

    const stockTickerListLength = stockTickerList.length;

    function get_duration_and_session(stockSessionDuration) { 
        if (stockSessionDuration  == "DAY") {
            return {stockSession: "NORMAL", stockDuration: "DAY" }
        } else if(stockSessionDuration == "GTC") {
            return {stockSession: "NORMAL", stockDuration: "GOOD_TILL_CANCEL" }
        } else if(stockSessionDuration == "EXT") {
            return {stockSession: "SEAMLESS", stockDuration: "DAY" }
        } else if(stockSessionDuration == "GTC_EXT") {
            return {stockSession: "SEAMLESS", stockDuration: "GOOD_TILL_CANCEL" }
        } else {
            return {stockSession: null, stockDuration: null }
        }        
    }

    async function handlePlaceOrder() {
        setDisabledButton(true);
        try {
            const allTradingAccountsOrderList = [];
            const {stockSession, stockDuration} = get_duration_and_session(stockSessionDuration)
            const stockStopPriceLinkType = stopPriceLinkTypeDict[stockStopPriceLinkTypeSymbol];
            const { data } = await axios.post("/stock_copy_trading/place_order/", { allTradingAccountsOrderList, stockSymbol, stockSession, stockDuration, 
                                            stockInstruction, stockOrderType, stockQuantity, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset })

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

    async function handleSaveOrder() {
        setDisabledButton(true);
        try {
            if (!stockSymbol || !stockInstruction || !stockOrderType || !stockQuantity || !stockPrice) {
                alert("Please ensure stock information is completed");
            } else {
                const {data} = await axios.post("/stock_save_order/add_stock_save_order/", { stockSymbol, stockInstruction, stockOrderType, stockQuantity, stockPrice });
                if (data.success != true) {
                    alert("Save order failed");
                } else {
                    alert("Save order successful");
                    setStockSaveOrderList(data.list)
                    setIsOpenTradingStock(!isOpenTradingStock);
                }
            }
        } catch (error) {
            alert("Save order failed")
            console.log(error.message);
        }
        setDisabledButton(false);
    }

    async function getStockList() {
        try {
            setIsLoading(true);
            setStockPrice(0);
            const { data } = await axios.get("/stock_copy_trading/get_stock_quotes/", { params: { stockSymbol }, timeout: 5000})
            if (data != null) {
                // set first stock data when user get new stock list
                const stockBidPrice = data[stockSymbol]["bidPrice"];
                setStockPrice(stockBidPrice);
                setStockStopPrice(stockBidPrice);
            } else {
                alert("Failed to get stock");
            }
            setIsLoading(false);
        } catch (error) {
            console.log(error.message);
            alert("Failed to get stock");
            setIsLoading(false);
        }
    }

    async function stock_list_fetch() {
        try {
          const {data} = await axios.get("/stock/get_stock_list"); 
          setStockTickerList(data.list);
  
        } catch(error) {
            console.log(error.message);
        }
    }

    async function handleStockAdd() {
        if (!stockTicker) {
            alert("Please ensure stock symbol is completed");
            return;
        }
        const isStockExist = stockTickerList.some(currentStockTicker => currentStockTicker === stockTicker);
        if (!isStockExist) {
            const response = await axios.post("/stock/add_stock/", { "stockSymbol": stockTicker })
            if (response.data.success != true) {
                alert("Add stock failed");
            } else {
                alert("Add stock successful");
            }

            setStockTickerList( isStockExist ? stockTickerList : [...stockTickerList, stockTicker]);
        } else {
            alert("Stock is already existed");
        }
    };

    async function handleStockRemove(currentStockTicker) {
        const response = await axios.delete("/stock/remove_stock/", { data:{ "stockSymbol": currentStockTicker }})

        if (response.data.success != true) {
            alert("Remove stock failed");
        } else {
            setStockTickerList(response.data.list);
            alert("Remove stock successful");
        }
    }

    useEffect( () => {
        if (stockStopPriceLinkTypeSymbol == "% Percent") {
            setStockStopPriceOffset(1.0)
        } else {
            setStockStopPriceOffset(0.1)
        }
    }, [stockStopPriceLinkTypeSymbol])
    
    useEffect( ()=> {
        if (stockSymbol != "" && stockPrice == 0) {
            getStockList();
        }

        if (stockOrderType == "MARKET") {
            setStockPrice(0);
            setStockStopPrice(0);
            setStockStopPriceLinkTypeSymbol("$ Dollars");
            setStockStopPriceOffset(0);
        } else if (stockOrderType == "LIMIT" && stockOrderType == "STOP")  {
            setStockStopPrice(0);
            setStockStopPriceLinkTypeSymbol("$ Dollars");
            setStockStopPriceOffset(0);
        } else if (stockOrderType == "STOP_LIMIT") {
            setStockStopPriceLinkTypeSymbol("$ Dollars");
            setStockStopPriceOffset(0);
        } else {
            setStockPrice(0);
            setStockStopPrice(0);
        }
    }, [stockSymbol, stockOrderType]);


    useEffect( () => {
        stock_list_fetch();
    }, [stockTickerListLength]);

    const handleSetStockName = (currentStockTicker) => {
        if (currentStockTicker == stockSymbol) {
            getStockList();
        } else {
            setStockSymbol(currentStockTicker);
            setStockPrice(0);
        }
        setStockInstruction(stockInstructionList[0]);
        setStockOrderType("LIMIT");
        setStockQuantity(1);
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
                                <label className="block text-gray-700 font-bold mb-2" htmlFor="stockTicker">Stock List</label>
                                <div className="flex gap-5">
                                    <input
                                        type="text"
                                        id="stockTicker"
                                        value={stockTicker}
                                        onInput={(event) => setStockTicker((event.target.value).toUpperCase())}
                                    />
                                    <button className="inline-block rounded bg-teal-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]" type="button" onClick={handleStockAdd}>
                                        <span>Add</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-scroll">
                                {stockTickerList.map((currentStockTicker, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between gap-5">
                                            <button
                                                className="inline-block rounded bg-grey-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                                onClick={() => handleSetStockName(currentStockTicker)}
                                            >
                                                {currentStockTicker}
                                            </button>
                                            <button
                                                className="inline-block rounded bg-red-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                                onClick={() => handleStockRemove(currentStockTicker)} 
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
                                onClick={handleSaveOrder}
                                disabled={disabledButton}>
                                Save order
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="mb-4">
                            <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Place Order On All Active Accounts</h1>
                        </div>
                        <div>
                            <div className="relative w-full lg:max-w-sm mb-6">
                                {/*<select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={event => setStockTickerName(event.target.value)}>
                                    {
                                        stockNameList.map((stock_name, index) => (
                                            <FixedSizeList key={index}>{stock_name}</FixedSizeList>
                                        ))
                                    }
                                </select>*/}
                                <div className="grid items-end gap-6 mb-6 grid-cols-2">
                                    <div className="relative">
                                        <input
                                            id="stock_pair"
                                            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            type="text"
                                            onChange={event => setStockSymbol(event.target.value)}
                                            value={stockSymbol}
                                            onInput={(event) => event.target.value = (event.target.value).toUpperCase()}
                                            placeholder=" " />
                                        <label
                                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                            htmlFor="stock_pair">
                                            Stock Pair:
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <select
                                            id="stock_instruction"
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                            value={stockInstruction}
                                            onChange={event => setStockInstruction(event.target.value)}>
                                            {
                                                stockInstructionList.map((stock_instruction, index) => (
                                                    <option key={index}>{stock_instruction}</option>
                                                ))
                                            }
                                        </select>
                                        <label
                                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                            htmlFor="stock_instruction">
                                            Stock instruction:
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                                <div className="relative">
                                    <select
                                        id="stock_session_duration"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        value={stockSessionDuration}
                                        onChange={event => setStockSessionDuration(event.target.value)}>
                                        {
                                            stockSessionDurationList.map((stock_session_duration, index) => (
                                                <option key={index}>{stock_session_duration}</option>
                                            ))
                                        }
                                    </select>
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="stock_session_duration">
                                        Stock session duration:
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
                                        id="stock_order_type"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        value={stockOrderType}
                                        onChange={event => setStockOrderType(event.target.value)}>
                                        {
                                            stockOrderTypeList.map((stock_order_type, index) => (
                                                <option key={index}>{stock_order_type}</option>
                                            ))
                                        }
                                    </select>
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="stock_order_type">
                                        Stock order type:
                                    </label>
                                </div>
                            </div>
                            <div className="grid items-end gap-6 mb-6 grid-cols-2">
                                <div className="relative">
                                    <input
                                        id="stock_total"
                                        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        type="text"
                                        onChange={event => setStockQuantity(event.target.value)}
                                        value={stockQuantity}
                                        placeholder=" " />
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="stock_total">
                                        Stock Total:
                                    </label>
                                </div>
                                { stockOrderType != "MARKET" && stockOrderType != "TRAILING_STOP" &&
                                    <div className="relative">
                                        <input className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            id="stock_price"
                                            type="text"
                                            onChange={event => setStockPrice(event.target.value)}
                                            value={stockPrice}
                                            placeholder=" " />
                                        <label
                                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                            htmlFor="stock_price">
                                            Stock Price:
                                        </label>
                                    </div>
                                }
                            </div>
                            <div className="grid items-end gap-6 mb-6 grid-cols-2">
                                <div className="relative">
                                { stockOrderType == "TRAILING_STOP" && <div className="relative">
                                    <select
                                        id="stock_stopPriceLinkType"
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                        value={stockStopPriceLinkTypeSymbol}
                                        onChange={event => setStockStopPriceLinkTypeSymbol(event.target.value)}>
                                        {
                                            Object.keys(stopPriceLinkTypeDict).map((stopPriceLinkType_key, index) => (
                                                <option key={index}>{stopPriceLinkType_key}</option>
                                            ))
                                        }
                                    </select>
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="stock_stopPriceLinkType">
                                        Stop Price Link Type:
                                    </label>
                                </div> }
                                </div>
                                { stockOrderType == "STOP_LIMIT" && <div className="relative">
                                    <input
                                        id="stop_activation_price"
                                        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        type="text"
                                        onChange={event => setStockStopPrice(event.target.value)}
                                        value={stockStopPrice}
                                        placeholder=" " />
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="stop_activation_price">
                                        Activation Price:
                                    </label>
                                </div> }
                                { stockOrderType == "TRAILING_STOP" && <div className="relative">
                                    <input
                                        id="stop_price_offset"
                                        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        type="text"
                                        onChange={event => setStockStopPriceOffset(event.target.value)}
                                        value={stockStopPriceOffset}
                                        placeholder=" " />
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="stop_price_offset">
                                        Stop Price Offset:
                                    </label>
                                </div> }
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