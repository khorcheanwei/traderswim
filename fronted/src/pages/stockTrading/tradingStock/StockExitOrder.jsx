import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { StockCopyTradingPositionContext } from '../context/StockCopyTradingPositionContext';

export default function StockExitOrder({ rowCopyTradingPosition, onClose }) {
    const {isOpenOrderExit, setIsOpenOrderExit, stockCopyTradingPositionDataDict, setStockCopyTradingPositionDataDict} = useContext(StockCopyTradingPositionContext);
    
    var stockInstructionList = ["BUY", "SELL"];
    var stockOrderTypeList = ["MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"];
    var stockSessionDurationList = ["DAY", "GTC", "EXT", "GTC_EXT"];

    let rowStockSymbol = rowCopyTradingPosition.cell.row.original.stockSymbol;
    const copyTradingPositionAllAccountData = stockCopyTradingPositionDataDict[rowStockSymbol];

    //let rowStockInstruction =rowCopyTradingPosition.cell.row.original.stockInstruction;
    //let rowStockOrderType = rowCopyTradingPosition.cell.row.original.stockOrderType;
    let rowStockSettledQuantity = rowCopyTradingPosition.cell.row.original.stockSettledQuantity;
    if (rowStockSettledQuantity < 0) {
        rowStockSettledQuantity = -rowStockSettledQuantity;
    }
    
    let rowStockAveragePrice = rowCopyTradingPosition.cell.row.original.stockAveragePrice;

    const [stockSymbol, setStockSymbol] = useState(rowStockSymbol) 
    const [stockInstruction, setStockInstruction] = useState(stockInstructionList[0]);
    const [stockOrderType, setStockOrderType] = useState("LIMIT");
    const [stockQuantity, setStockQuantity] = useState(rowStockSettledQuantity)
    const [stockPrice, setStockPrice] = useState(rowStockAveragePrice)
  
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
            <div>
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
                    onClick={handleExitOrder}>
                    Exit order
                </button>
            </div>
        </div>
    )
}