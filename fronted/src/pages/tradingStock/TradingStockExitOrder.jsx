import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { CopyTradingPositionContext } from '../context/CopyTradingPositionContext';

export default function TradingStockExitOrder({ rowCopyTradingPosition, onClose }) {

    const {isOpenOrderExit, setIsOpenOrderExit} = useContext(CopyTradingPositionContext);
    const {copyTradingPositionDataDict, setCopyTradingPositionDataDict} = useContext(CopyTradingPositionContext);

    var optionChainInstructionList = ["SELL_TO_CLOSE", "BUY_TO_OPEN"];
    var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    let optionChainDescription = rowCopyTradingPosition.cell.row.original.optionChainDescription;
    const copyTradingPositionAllAccountData = copyTradingPositionDataDict[optionChainDescription];

    let rowOptionChainSymbol = rowCopyTradingPosition.cell.row.original.optionChainSymbol;
    //let rowOptionChainInstruction =rowCopyTradingPosition.cell.row.original.optionChainInstruction;
    //let rowOptionChainOrderType = rowCopyTradingPosition.cell.row.original.optionChainOrderType;
    let rowOptionChainSettledQuantity = rowCopyTradingPosition.cell.row.original.optionChainSettledQuantity;
    if (rowOptionChainSettledQuantity < 0) {
        rowOptionChainSettledQuantity = -rowOptionChainSettledQuantity;
    }
    
    let rowOptionChainAveragePrice = rowCopyTradingPosition.cell.row.original.optionChainAveragePrice;

    const [optionChainSymbol, setOptionChainSymbol] = useState(rowOptionChainSymbol) 
    const [optionChainInstruction, setOptionChainInstruction] = useState(optionChainInstructionList[0]);
    const [optionChainOrderType, setOptionChainOrderType] = useState(optionChainOrderTypeList[0]);
    const [optionChainQuantity, setOptionChainQuantity] = useState(rowOptionChainSettledQuantity)
    const [optionChainPrice, setOptionChainPrice] = useState(rowOptionChainAveragePrice)
  
    async function handleExitOrder() {
        try {

            const allTradingAccountsOrderList = copyTradingPositionAllAccountData.map(item => ({
                accountId: item.accountId,
                accountName: item.accountName,
                accountUsername: item.accountUsername
              }));

            const { data } = await axios.post("/copy_trading_account/exit_order/", { allTradingAccountsOrderList, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice })

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
                <h1 className="block text-white text-lm font-bold mb-2">Option Exit Order</h1>
            </div>
            <div>
                <div className="relative">
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline">
                       {optionChainDescription}
                    </div>
                    <label
                        className="absolute text-sm bg-black text-white px-2 left-1"
                        htmlFor="small_outlined">
                        Option Chain Description:
                    </label>
                </div>
                <div className="grid items-end gap-6 mb-6 md:grid-cols-2">
                    <div className="relative">
                        <select
                            className="bg-black border w-full py-2 px-2 text-white mb-4 leading-tight"
                            value={optionChainInstruction}
                            onChange={event => setOptionChainInstruction(event.target.value)}>
                            {
                                optionChainInstructionList.map((option_chain_instruction, index) => (
                                    <option key={index}>{option_chain_instruction}</option>
                                ))
                            }
                        </select>
                        <label
                            className="absolute text-sm bg-black text-white px-2 left-1"
                            htmlFor="small_outlined">
                            Option Chain instruction:
                        </label>
                    </div>
                    <div className="relative">
                        <select
                            className="bg-black border w-full py-2 px-2 text-white mb-4 leading-tight"
                            value={optionChainOrderType}
                            onChange={event => setOptionChainOrderType(event.target.value)}>
                            {
                                optionChainOrderTypeList.map((option_chain_order_type, index) => (
                                    <option key={index}>{option_chain_order_type}</option>
                                ))
                            }
                        </select>
                        <label
                            className="absolute text-sm bg-black text-white px-2 left-1"
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
                            className="absolute text-sm bg-black text-white px-2 left-1"
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
                            className="absolute text-sm bg-black text-white px-2 left-1"
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
                    className="inline-block rounded bg-red-600 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={handleExitOrder}>
                    Exit order
                </button>
            </div>
        </div>
    )
}