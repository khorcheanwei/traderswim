import axios from 'axios';
import { useState } from 'react';
import StockHandleOrder, {get_duration_and_session} from './StockHandleOrder';

export default function StockExitOrderSelected({ selectedPositionDict, onClose }) {
    
    const [isLoading, setIsLoading] = useState(false);

    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stockStopPriceLinkTypeDict = {"$ Dollars": "VALUE", "% Percent":"PERCENT"};
    var stockStopPriceLinkTypeReverseDict = {"VALUE": "$ Dollars", "PERCENT":"% Percent"};

    let firstAccountUsername = Object.keys(selectedPositionDict)[0];
    let firstSelectedPosition = selectedPositionDict[firstAccountUsername];

    let rowStockSymbol = firstSelectedPosition.stockSymbol;
    let rowStockPrice = firstSelectedPosition.stockAveragePrice;
    let rowStockQuantity = firstSelectedPosition.stockSettledQuantity;
    
    const [stockSymbol, setStockSymbol]= useState(rowStockSymbol);
    const [stockInstruction, setStockInstruction] = useState("SELL");
    const [stockSessionDuration, setStockSessionDuration] = useState("DAY");
    const [stockOrderType, setStockOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(rowStockQuantity);

    const [stockPrice, setStockPrice] = useState(rowStockPrice);
    const [stockStopPrice, setStockStopPrice] = useState(0);
    const [stockStopPriceLinkTypeSymbol, setStockStopPriceLinkTypeSymbol] = useState("$ Dollars");
    const [stockStopPriceOffset, setStockStopPriceOffset] = useState(0.1);

    const [disabledButton, setDisabledButton] = useState(false);

    async function handleExitOrder() {
        setDisabledButton(true);
        try {
            let allTradingAccountsOrderList = [];

            for (const accountUsername in selectedPositionDict) {
                const selectedPosition = selectedPositionDict[accountUsername];
                const selectedPositionAccountData =  {
                    accountId: selectedPosition["accountId"],
                    accountName: selectedPosition["accountName"],
                    accountUsername: selectedPosition["accountUsername"]
                }
                allTradingAccountsOrderList.push(selectedPositionAccountData);
            }

            const {stockSession, stockDuration} = get_duration_and_session(stockSessionDuration);
            const stockStopPriceLinkType = stockStopPriceLinkTypeDict[stockStopPriceLinkTypeSymbol];

            const { data } = await axios.post("/stock_copy_trading/exit_order/", { allTradingAccountsOrderList, stockSymbol, stockSession, stockDuration, 
                stockInstruction, stockOrderType, stockQuantity, stockPrice, stockStopPrice, stockStopPriceLinkType, stockStopPriceOffset })

            if (data != "success") {
                alert("Exit order failed");
            } else {
                alert("Exit order successful");
                onClose();
            }
        } catch (error) {
            alert("Exit order failed")
            console.log(error.message);
        }
        setDisabledButton(false);
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Exit Order</h1>
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
                    onClick={handleExitOrder}
                    disabled={disabledButton}>
                    Exit order
                </button>
            </div>
        </div>
    )
}