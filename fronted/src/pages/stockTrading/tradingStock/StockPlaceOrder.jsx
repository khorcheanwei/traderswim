import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';


export default function StockPlaceOrder({ rowCopyTradingOrder, onClose, isOpenOrderPlace, setIsOpenOrderPlace }) {

    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stopPriceLinkTypeDict = {"$ Dollars": "VALUE", "% Percent": "PERCENT" }

    let agentTradingSessionID = rowCopyTradingOrder.cell.row.original.agentTradingSessionID;
    let rowStockSymbol = rowCopyTradingOrder.cell.row.original.stockSymbol;
    let rowStockInstruction = rowCopyTradingOrder.cell.row.original.stockInstruction;
    let rowStockOrderType = rowCopyTradingOrder.cell.row.original.stockOrderType;
    let rowStockQuantity = rowCopyTradingOrder.cell.row.original.stockQuantity;
    let rowStockPrice = rowCopyTradingOrder.cell.row.original.stockPrice;

    const [stockSymbol, setStockSymbol]= useState("");
    const [stockInstruction, setStockInstruction] = useState(stockInstructionList[0]);
    const [stockSessionDuration, setStockSessionDuration] = useState("DAY");
    const [stockOrderType, setStockOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(1);

    const [stockPrice, setStockPrice] = useState(0);
    const [stockStopPrice, setStockStopPrice] = useState(0);
    const [stockStopPriceLinkTypeSymbol, setStockStopPriceLinkTypeSymbol] = useState("$ Dollars")
    const [stockStopPriceOffset, setStockStopPriceOffset] = useState(0.1);

    const {stockCopyTradingOrderDataDict, setStockCopyTradingOrderDataDict} = useContext(StockCopyTradingOrderContext);

    const copyTradingAllAccountData = stockCopyTradingOrderDataDict[agentTradingSessionID];

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
        try {
            const allTradingAccountsOrderList = [];
             
            const { data } = await axios.post("/stock_copy_trading/place_order/", { allTradingAccountsOrderList, stockSymbol, stockInstruction, stockOrderType, stockQuantity, stockPrice })
            if (data != "success") {
                alert("Place order failed");
            } else {
                alert("Place order successful");
            }
            setIsOpenOrderPlace(!isOpenOrderPlace); 
        } catch (error) {
            alert("Place order failed")
            console.log(error.message);
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
            getStockQuotes();
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