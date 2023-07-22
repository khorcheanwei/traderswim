import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';

export default function TradingStockReplaceOrderIndividual({ rowCopyTradingOrderIndividual, onClose }) {

    const {isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual} = useContext(CopyTradingOrderContext);

    var optionChainInstructionList = ["BUY_TO_OPEN", "SELL_TO_CLOSE"];
    var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

    let accountId = rowCopyTradingOrderIndividual.cell.row.original.accountId;
    let accountName = rowCopyTradingOrderIndividual.cell.row.original.accountName;
    let accountUsername = rowCopyTradingOrderIndividual.cell.row.original.accountUsername;
    let agentTradingSessionID = rowCopyTradingOrderIndividual.cell.row.original.agentTradingSessionID;
    let optionChainOrderId = rowCopyTradingOrderIndividual.cell.row.original.optionChainOrderId;
    let optionChainDescription = rowCopyTradingOrderIndividual.cell.row.original.optionChainDescription;
    let rowOptionChainSymbol = rowCopyTradingOrderIndividual.cell.row.original.optionChainSymbol;
    let rowOptionChainInstruction = rowCopyTradingOrderIndividual.cell.row.original.optionChainInstruction;
    let rowOptionChainOrderType = rowCopyTradingOrderIndividual.cell.row.original.optionChainOrderType;
    let rowOptionChainQuantity = rowCopyTradingOrderIndividual.cell.row.original.optionChainQuantity;
    let rowOptionChainPrice = rowCopyTradingOrderIndividual.cell.row.original.optionChainPrice;

    const [optionChainSymbol, setOptionChainSymbol] = useState(rowOptionChainSymbol);
    const [optionChainInstruction, setOptionChainInstruction] = useState(rowOptionChainInstruction);
    const [optionChainOrderType, setOptionChainOrderType] = useState(rowOptionChainOrderType);
    const [optionChainQuantity, setOptionChainQuantity] = useState(rowOptionChainQuantity)
    const [optionChainPrice, setOptionChainPrice] = useState(rowOptionChainPrice)
  
    async function handleReplaceOrderIndividual() {
        try {
            const { data } = await axios.put("/copy_trading_account/replace_order_individual/", { agentTradingSessionID, accountId, accountName, accountUsername, optionChainOrderId, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice })

            if (data != "success") {
                alert("Replace order failed");
            } else {
                alert("Replace order successful");
            }
            setIsOpenOrderReplaceIndividual(!isOpenOrderReplaceIndividual); 
        } catch (error) {
            alert("Replace order failed")
            console.log(error.message);
        }
    }

    return (
        <div>
            <div className="mb-4">
                <h1 className="block text-white text-lm font-bold mb-2">Option Replace Order (Individual) - <b>{accountUsername}</b></h1>
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
                            onChange={event => setOptionChainInstruction(event.target.value)}
                            >
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
                            className="bg-black border w-full py-2 px-2 text-white mb-4 leading-tight"
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
                        <input className="bg-black border w-full py-2 px-2 text-white mb-4 leading-tight"
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
                    className="inline-block rounded bg-yellow-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    onClick={handleReplaceOrderIndividual}>
                    Replace order
                </button>
            </div>
        </div>
    )
}