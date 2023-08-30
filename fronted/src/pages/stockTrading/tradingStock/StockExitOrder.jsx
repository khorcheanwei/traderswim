import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { StockCopyTradingPositionContext } from '../context/StockCopyTradingPositionContext';
import StockHandleOrder, {getStockQuotes} from './StockHandleOrder';

export default function StockExitOrder({ rowCopyTradingPosition, onClose, isOpenOrderExit, setIsOpenOrderExit }) {
    const [isLoading, setIsLoading] = useState(false);
    const {stockCopyTradingPositionDataDict, setStockCopyTradingPositionDataDict} = useContext(StockCopyTradingPositionContext);
    
    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    var stockStopPriceLinkTypeDict = {"$ Dollars": "VALUE", "% Percent":"PERCENT"};
    var stockStopPriceLinkTypeReverseDict = {"VALUE": "$ Dollars", "PERCENT":"% Percent"};

    //let agentTradingSessionID = rowCopyTradingPosition.cell.row.original.agentTradingSessionID;

    let rowStockSymbol = rowCopyTradingPosition.cell.row.original.stockSymbol;
    let rowStockPrice = rowCopyTradingPosition.cell.row.original.stockAveragePrice;
    let rowStockQuantity = rowCopyTradingPosition.cell.row.original.stockSettledQuantity;
    
    const [stockSymbol, setStockSymbol]= useState(rowStockSymbol);
    const [stockInstruction, setStockInstruction] = useState("BUY");
    const [stockSessionDuration, setStockSessionDuration] = useState("DAY");
    const [stockOrderType, setStockOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(rowStockQuantity);

    const [stockPrice, setStockPrice] = useState(rowStockPrice);
    const [stockStopPrice, setStockStopPrice] = useState(0);
    const [stockStopPriceLinkTypeSymbol, setStockStopPriceLinkTypeSymbol] = useState("$ Dollars");
    const [stockStopPriceOffset, setStockStopPriceOffset] = useState(0.1);

    const [disabledButton, setDisabledButton] = useState(false)

  
    async function handleExitOrder() {
        try {

            const allTradingAccountsOrderList = copyTradingPositionAllAccountData.map(item => ({
                accountId: item.accountId,
                accountName: item.accountName,
                accountUsername: item.accountUsername
              }));

            const { data } = await axios.post("/stock_copy_trading/exit_order/", { allTradingAccountsOrderList, stockSymbol, stockInstruction, stockOrderType, stockQuantity, stockPrice })

            if (data != "success") {
                alert("Exit order failed");
            } else {
                alert("Exit order successful");
            }
            setIsOpenOrderExit(!isOpenOrderExit); 
        } catch (error) {
            alert("Exit order failed")
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Exit Order</h1>
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
                    onClick={handleExitOrder}>
                    Exit order
                </button>
            </div>
        </div>
    )
}