import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';

export default function TradingStockReplaceOrder({ rowCopyTradingOrder, onClose }) {

    const {isOpenOrderReplace, setIsOpenOrderReplace} = useContext(CopyTradingOrderContext);

    var optionChainInstructionList = ["BUY_TO_OPEN", "SELL_TO_CLOSE"];
    var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    let agentTradingSessionID = rowCopyTradingOrder.cell.row.original.agentTradingSessionID;
    let optionChainDescription = rowCopyTradingOrder.cell.row.original.optionChainDescription;
    let rowOptionChainSymbol = rowCopyTradingOrder.cell.row.original.optionChainSymbol;
    let rowOptionChainInstruction = rowCopyTradingOrder.cell.row.original.optionChainInstruction;
    let rowOptionChainOrderType = rowCopyTradingOrder.cell.row.original.optionChainOrderType;
    let rowOptionChainQuantity = rowCopyTradingOrder.cell.row.original.optionChainQuantity;
    let rowOptionChainPrice = rowCopyTradingOrder.cell.row.original.optionChainPrice;

    const [optionChainSymbol, setOptionChainSymbol] = useState(rowOptionChainSymbol);
    const [optionChainInstruction, setOptionChainInstruction] = useState(rowOptionChainInstruction);
    const [optionChainOrderType, setOptionChainOrderType] = useState(rowOptionChainOrderType);
    const [optionChainQuantity, setOptionChainQuantity] = useState(rowOptionChainQuantity);
    const [optionChainPrice, setOptionChainPrice] = useState(rowOptionChainPrice);

    const {copyTradingOrderDataDict, setCopyTradingOrderDataDict} = useContext(CopyTradingOrderContext);

    const copyTradingAllAccountData = copyTradingOrderDataDict[agentTradingSessionID];
  
    async function handleReplaceOrder() {
        try {
            const allTradingAccountsOrderList = copyTradingAllAccountData.map(item => ({
                accountId: item.accountId,
                accountName: item.accountName,
                accountUsername: item.accountUsername,
                optionChainOrderId: item.optionChainOrderId
              }));
             
            const { data } = await axios.put("/copy_trading_account/replace_order/", { agentTradingSessionID, allTradingAccountsOrderList, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice })

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
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-white text-lm font-bold mb-2">Option Replace Order ( {copyTradingAllAccountData.length} accounts )</h1>
            </div>
            <div>
                <div className="relative">
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline">
                       {optionChainDescription}
                    </div>
                    <label
                        className="absolute text-sm bg-black text-white text-whitduration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                        htmlFor="small_outlined">
                        Option Chain Description:
                    </label>
                </div>
                <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                    <div className="relative">
                        <select
                            className="shadow appearance-none bg-black border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={optionChainInstruction}
                            onChange={event => setOptionChainInstruction(event.target.value)}
                            >
                            {
                                optionChainInstructionList.map((option_chain_instruction, index) => (
                                    <option key={index}>{option_chain_instruction}</option>
                                ))
                            }
                        </select>
                        <label
                            className="absolute text-sm bg-black text-white text-whitduration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Option Chain instruction:
                        </label>
                    </div>
                    <div className="relative">
                        <select
                            className="shadow appearance-none bg-black border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            value={optionChainOrderType}
                            onChange={event => setOptionChainOrderType(event.target.value)}>
                            {
                                optionChainOrderTypeList.map((option_chain_order_type, index) => (
                                    <option key={index}>{option_chain_order_type}</option>
                                ))
                            }
                        </select>
                        <label
                            className="absolute text-sm bg-black text-white text-whitduration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Option Chain order type:
                        </label>
                    </div>
                </div>
                <div className="grid items-end gap-6 mb-6 grid-cols-2">
                    <div className="relative">
                        <input
                            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-white bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            type="text"
                            onChange={event => setOptionChainQuantity(event.target.value)}
                            value={optionChainQuantity}
                            placeholder=" " />
                        <label
                            className="absolute text-sm bg-black text-white text-whitduration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
                            htmlFor="small_outlined">
                            Option Contract Total:
                        </label>
                    </div>
                    <div className="relative">
                        <input className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-white bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                            type="text"
                            onChange={event => setOptionChainPrice(event.target.value)}
                            value={optionChainPrice}
                            placeholder=" " />
                        <label
                            className="absolute text-sm bg-black text-white text-whitduration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
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
                    onClick={handleReplaceOrder}>
                    Replace order
                </button>
            </div>
        </div>
    )
}