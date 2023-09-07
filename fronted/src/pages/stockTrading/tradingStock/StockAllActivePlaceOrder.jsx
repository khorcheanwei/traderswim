import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import StockHandleOrder, {get_duration_and_session, getStockQuotes} from './StockHandleOrder';
import { StockPlaceOrderContext } from '../context/StockPlaceOrderContext';
import { StockPlaceOrderPanelContext } from '../context/StockPlaceOrderPanelContext';
import { ClipLoader } from 'react-spinners';

export default function StockAllActivePlaceOrder({ onClose }) {
    const [isLoading, setIsLoading] = useState(false);

    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stockStopPriceLinkTypeDict = {"$ Dollars": "VALUE", "% Percent": "PERCENT" }

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

    async function handleSaveOrder() {
        setDisabledButton(true);
        try {
            if (!stockSymbol || !stockInstruction || !stockOrderType || !stockQuantity) {
                alert("Please ensure stock information is completed");
            } else {
                const {stockSession, stockDuration} = get_duration_and_session(stockSessionDuration)
                const stockStopPriceLinkType = stockStopPriceLinkTypeDict[stockStopPriceLinkTypeSymbol];
                const {data} = await axios.post("/stock_save_order/add_stock_save_order/", { stockSymbol, stockSession, stockDuration, stockOrderType, stockInstruction,
                                                                                            stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset, stockQuantity});
      
                if (data.success != true) {
                    alert("Save order failed");
                } else {
                    alert("Save order successful");
                    setStockSaveOrderList(data.list);
                    onClose();
                }
            }
        } catch (error) {
            alert("Save order failed")
            console.log(error.message);
        }
        setDisabledButton(false);
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

    const handleSetStockName = (currentStockTicker) => {
        if (currentStockTicker == stockSymbol) {
            getStockQuotes(setIsLoading, stockSymbol, setStockPrice, setStockStopPrice);
        } else {
            setStockSymbol(currentStockTicker);
            setStockPrice(0);
        }
        setStockInstruction(stockInstructionList[0]);
        setStockOrderType("LIMIT");
        setStockQuantity(1);
    }


    async function handlePlaceOrder() {
        setDisabledButton(true);
        try {
            const allTradingAccountsOrderList = [];
            const {stockSession, stockDuration} = get_duration_and_session(stockSessionDuration)
            const stockStopPriceLinkType = stockStopPriceLinkTypeDict[stockStopPriceLinkTypeSymbol];
            const { data } = await axios.post("/stock_copy_trading/place_order/", { allTradingAccountsOrderList, stockSymbol, stockSession, stockDuration, 
                                            stockInstruction, stockOrderType, stockQuantity, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset })

            if (data != "success") {
                alert("Copy trading failed");
            } else {
                alert("Copy trading successful");
                onClose();
            }
        } catch (error) {
            alert("Copy trading failed")
            console.log(error.message);
        }
        setDisabledButton(false);
    }

    useEffect( () => {
        stock_list_fetch();
    }, [stockTickerListLength]);

    return (
        <div>
            {isLoading ? 
                (<ClipLoader loading={true} size={50} />) :  
                (<div className="flex gap-10">
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
                        <StockHandleOrder
                            isLoading={isLoading} setIsLoading={setIsLoading} 
                            stockSymbol={stockSymbol} setStockSymbol={setStockSymbol}
                            stockInstruction={stockInstruction} setStockInstruction={setStockInstruction}
                            stockSessionDuration={stockSessionDuration} setStockSessionDuration={setStockSessionDuration}
                            stockOrderType={stockOrderType} setStockOrderType={setStockOrderType}
                            stockQuantity={stockQuantity} setStockQuantity={setStockQuantity}
                            stockPrice={stockPrice} setStockPrice={setStockPrice}
                            stockStopPrice={stockStopPrice} setStockStopPrice={setStockStopPrice}
                            stockStopPriceLinkTypeSymbol={stockStopPriceLinkTypeSymbol} setStockStopPriceLinkTypeSymbol={setStockStopPriceLinkTypeSymbol}
                            stockStopPriceOffset={stockStopPriceOffset} setStockStopPriceOffset={setStockStopPriceOffset}>    
                        </StockHandleOrder>
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
                </div> )
            }
        </div>
    )
}