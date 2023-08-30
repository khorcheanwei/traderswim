import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';
import StockHandleOrder from './StockHandleOrder';
import { ClipLoader } from 'react-spinners';

export default function TradingStockReplaceOrder({ rowCopyTradingOrder, onClose, isOpenOrderReplace, setIsOpenOrderReplace }) {
    const [isLoading, setIsLoading] = useState(false);

    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stockStopPriceLinkTypeDict = {"$ Dollars": "VALUE", "% Percent":"PERCENT"};
    var stockStopPriceLinkTypeReverseDict = {"VALUE": "$ Dollars", "PERCENT":"% Percent"};

    let agentTradingSessionID = rowCopyTradingOrder.cell.row.original.agentTradingSessionID;

    let rowStockSymbol = rowCopyTradingOrder.cell.row.original.stockSymbol;
    let rowStockSession = rowCopyTradingOrder.cell.row.original.stockSession;
    let rowStockDuration = rowCopyTradingOrder.cell.row.original.stockDuration;
    let rowStockOrderType = rowCopyTradingOrder.cell.row.original.stockOrderType;
    let rowStockInstruction = rowCopyTradingOrder.cell.row.original.stockInstruction;
    let rowStockPrice = rowCopyTradingOrder.cell.row.original.stockPrice ?? 0;
    let rowStockStopPrice = rowCopyTradingOrder.cell.row.original.stockStopPrice ?? 0;
    let rowStockStopPriceLinkType = rowCopyTradingOrder.cell.row.original.stockStopPriceLinkType ?? "VALUE";
    let rowStockStopPriceOffset = rowCopyTradingOrder.cell.row.original.stockStopPriceOffset ?? 0.1;
    let rowStockQuantity = rowCopyTradingOrder.cell.row.original.stockQuantity;
    
    const [stockSymbol, setStockSymbol]= useState(rowStockSymbol);
    const [stockInstruction, setStockInstruction] = useState(rowStockInstruction);
    const [stockSessionDuration, setStockSessionDuration] = useState(get_duration_and_session_reverse(rowStockSession, rowStockDuration));
    const [stockOrderType, setStockOrderType] = useState(rowStockOrderType);
    const [stockQuantity, setStockQuantity] = useState(rowStockQuantity);

    const [stockPrice, setStockPrice] = useState(rowStockPrice);
    const [stockStopPrice, setStockStopPrice] = useState(rowStockStopPrice);
    const [stockStopPriceLinkTypeSymbol, setStockStopPriceLinkTypeSymbol] = useState(stockStopPriceLinkTypeReverseDict[rowStockStopPriceLinkType]);
    const [stockStopPriceOffset, setStockStopPriceOffset] = useState(rowStockStopPriceOffset);

    const [disabledButton, setDisabledButton] = useState(false)

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

    function get_duration_and_session_reverse(session, duration) { 
        if(session == "NORMAL" && duration == "DAY") {
            return "DAY";
        } else if (session == "NORMAL" && duration == "GOOD_TILL_CANCEL") {
            return "GTC";
        } else if (session == "SEAMLESS" && duration == "DAY") {
            return "EXT"
        } else if (session == "SEAMLESS" && duration == "GOOD_TILL_CANCEL") {
            return "GTC_EXT"
        } else {
            return null;
        }
    }
  
    async function handleReplaceOrder() {
        setDisabledButton(true);
        try {
            const allTradingAccountsOrderList = copyTradingAllAccountData.map(item => ({
                accountId: item.accountId,
                accountName: item.accountName,
                accountUsername: item.accountUsername,
                stockOrderId: item.stockOrderId
              }));

            const {stockSession, stockDuration} = get_duration_and_session(stockSessionDuration);
            const stockStopPriceLinkType = stockStopPriceLinkTypeDict[stockStopPriceLinkTypeSymbol];
            const { data } = await axios.put("/stock_copy_trading/replace_order/", { agentTradingSessionID, allTradingAccountsOrderList, stockSymbol, stockSession, stockDuration, 
                                    stockInstruction, stockOrderType, stockQuantity, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset })

            if (data != "success") {
                alert("Replace order failed");
            } else {
                alert("Replace order successful");
            }
            setIsOpenOrderReplace(!isOpenOrderReplace); 
        } catch (error) {
            alert("Replace order failed")
            console.log(error.message);
        }
        setDisabledButton(false);
    }

    return (
        <div>
            {isLoading ? 
                (<ClipLoader loading={true} size={50} />) :  
                (<div>
                    <div className="mb-4">
                        <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Replace Order ( {copyTradingAllAccountData.length} accounts )</h1>
                    </div>
                    <StockHandleOrder 
                        isGetStockQuotes={false}
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
                            onClick={handleReplaceOrder}
                            disabled={disabledButton}>
                            Replace order
                        </button>
                    </div>
                </div>
                )
            }
        </div>
    )
}