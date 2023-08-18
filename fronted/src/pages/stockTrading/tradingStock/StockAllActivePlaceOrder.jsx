import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { StockPlaceOrderContext } from '../context/StockPlaceOrderContext';
import { StockPlaceOrderPanelContext } from '../context/StockPlaceOrderPanelContext';
import { ClipLoader } from 'react-spinners';


export default function StockAllActivePlaceOrder({ onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    var stockInstructionList = ["BUY", "SELL"];

    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    const { isOpenTradingStock, setIsOpenTradingStock } = useContext(StockPlaceOrderContext);
    const { stockSaveOrderList, setStockSaveOrderList } = useContext(StockPlaceOrderPanelContext);

    const [stockTickerName, setStockTickerName] = useState("");
    const [stockBuySell, setStockBuySell] = useState("");

    const [stockData, setStockData] = useState([]);
    const [stockDateList, setStockDateList] = useState([]);
    const [stockDate, setStockDate] = useState("None");
    const [stockStrikeList, setStockStrikeList] = useState([]);
    const [stockDescription, setStockDescription] = useState("None");

    const [refreshStockStrikeListKey, setRefreshStockStrikeListKey] = useState(0);

    const [stockSymbol, setStockSymbol]= useState("");
    const [stockInstruction, setStockInstruction] = useState(stockInstructionList[0]);
    const [stockOrderType, setStockOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(1)
    const [stockPrice, setStockPrice] = useState(0)

    const [disabledButton, setDisabledButton] = useState(false)

    const [stockTicker, setStockTicker] = useState("");
    const [stockTickerList, setStockTickerList] = useState([]);

    const stockTickerListLength = stockTickerList.length;

    async function handlePlaceOrder() {
        setDisabledButton(true);
        try {
            const allTradingAccountsOrderList = [];
            const { data } = await axios.post("/copy_trading_account/place_order/", { allTradingAccountsOrderList, stockSymbol, stockInstruction, stockOrderType, stockQuantity, stockPrice })

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
            if (!stockSymbol || !stockDescription || !stockInstruction || !stockOrderType || !stockQuantity || !stockPrice) {
                alert("Please ensure stock information is completed");
                return;
            }
            const {data} = await axios.post("/stock_save_order/add_stock_save_order/", { stockSymbol, stockDescription, stockInstruction, stockOrderType, stockQuantity, stockPrice });
            if (data.success != true) {
                alert("Save order failed");
            } else {
                alert("Save order successful");
                setStockSaveOrderList(data.list)
                setIsOpenTradingStock(!isOpenTradingStock);
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
            setRefreshStockStrikeListKey((prevKey) => prevKey + 1);

            setStockDateList([]);
            setStockStrikeList([]);
            setStockDescription("None");
            setStockPrice(0);
            const { data } = await axios.get("/copy_trading_account/get_stock_list/", { params: { stockTickerName, stockBuySell }, timeout: 5000})
            if (data != null) {
                setStockData(data);

                // set first stock data when user get new stock list
                const firstStockDate = Object.keys(data)[0];
                const firstStockStrikeList = Object.keys(data[firstStockDate]);
                const firstStockDescription = data[firstStockDate][firstStockStrikeList[0]][0]["description"];
                const firstStockSymbol = data[firstStockDate][firstStockStrikeList[0]][0]["symbol"];
                const firstStockBid = data[firstStockDate][firstStockStrikeList[0]][0]["bid"];
                
                setStockDate(firstStockDate);
                setStockDateList(Object.keys(data));
                setStockStrikeList(firstStockStrikeList);
                setStockDescription(firstStockDescription);

                setStockSymbol(firstStockSymbol);
                setStockPrice(firstStockBid);
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

    const handleIsStockCall = async () => {
        setStockBuySell("BUY");
    };

    const handleIsStockPut = async () => {
        setStockBuySell("SELL");
    };


    useEffect( () => {
        stock_list_fetch();
    }, [stockTickerListLength]);

    const handleSetStockName = (currentStockTicker) => {
        setStockTickerName(currentStockTicker)
        setStockBuySell("");

        setStockData([]);
        setStockDateList([]);
        setStockDate("None");
        setStockStrikeList([]);
        setStockDescription("None");

        setStockSymbol("");
        setStockInstruction(stockInstructionList[0]);
        setStockOrderType("LIMIT");
        setStockQuantity(1);
        setStockPrice(0);
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
                                onClick={saveOrder}
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
                                            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            type="text"
                                            onChange={event => setStockTickerName(event.target.value)}
                                            value={stockTickerName}
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
                                            BUY
                                            <br />
                                            <input
                                                className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                type="checkbox"
                                                checked={stockBuySell}
                                                onChange={handleIsStockCall}
                                            />
                                        </label>
                                        <label>
                                            SELL
                                            <br />
                                            <input
                                                className="w-7 h-7 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                type="checkbox"
                                                checked={stockBuySell}
                                                onChange={handleIsStockPut}
                                            />
                                        </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                                <div className="relative">
                                    <select
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
                                        htmlFor="small_outlined">
                                        Stock instruction:
                                    </label>
                                </div>
                                <div className="relative">
                                    <select
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
                                        htmlFor="small_outlined">
                                        Stock order type:
                                    </label>
                                </div>
                            </div>
                            <div className="grid items-end gap-6 mb-6 grid-cols-2">
                                <div className="relative">
                                    <input
                                        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        type="text"
                                        onChange={event => setStockQuantity(event.target.value)}
                                        value={stockQuantity}
                                        placeholder=" " />
                                    <label
                                        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                                        htmlFor="small_outlined">
                                        Stock Total:
                                    </label>
                                </div>
                                <div className="relative">
                                    <input className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        type="text"
                                        onChange={event => setStockPrice(event.target.value)}
                                        value={stockPrice}
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