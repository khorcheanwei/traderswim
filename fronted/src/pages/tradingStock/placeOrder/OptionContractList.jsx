import axios from 'axios';
import { useContext, useState, useEffect, memo } from 'react';
import { OptionPlaceOrderPanelContext } from '../../context/OptionPlaceOrderPanelContext';
import { OptionContractPlaceOrderContextProvider, useOptionContractPlaceOrderContext } from '../../context/OptionContractPlaceOrderContext';

export default function OptionContractList({allActivePlaceOrderClose}) {
    console.log("hghgf")
    const {optionContractSaveOrderList, setOptionContractSaveOrderList } = useContext(OptionPlaceOrderPanelContext);

    const [disabledButton, setDisabledButton] = useState(false);

    const {  optionChainDescription, optionChainSymbol, optionChainInstruction, optionChainOrderType, optionChainQuantity, 
        optionChainPrice, optionContractTicker, optionContractTickerList, dispatch } = useOptionContractPlaceOrderContext();

    const optionContractTickerListLength = optionContractTickerList.length;

    async function saveOrder() {
        setDisabledButton(true)
        try {
            if (!optionChainSymbol || !optionChainDescription || !optionChainInstruction || !optionChainOrderType || !optionChainQuantity || !optionChainPrice) {
                alert("Please ensure option contract information is completed");
                return;
            }
            const {data} = await axios.post("/option_contract_save_order/add_option_contract_save_order/", { optionChainSymbol, optionChainDescription, optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice });
            if (data.success != true) {
                alert("Save order failed");
            } else {
                alert("Save order successful");
                setOptionContractSaveOrderList(data.list);
                allActivePlaceOrderClose();
            }
        } catch (error) {
            alert("Save order failed")
            console.log(error.message);
        }
        setDisabledButton(false)
    }

    async function option_contract_list_fetch() {
        try {
          const {data} = await axios.get("/option_contract/get_option_contract_list"); 
          dispatch({type: "setOptionContractTickerList", payload: data.list});  
        } catch(error) {
            console.log(error.message);
        }
    }

    async function handleOptionContractAdd() {
        if (!optionContractTicker) {
            alert("Please ensure option contract symbol is completed");
            return;
        }
        const isOptionContractExist = optionContractTickerList.some(currentOptionContractTicker => currentOptionContractTicker === optionContractTicker);
        if (!isOptionContractExist) {
            const {data} = await axios.post("/option_contract/add_option_contract/", { "optionChainSymbol": optionContractTicker })
            if (data.success != true) {
                alert("Add option contract failed");
            } else {
                alert("Add option contract successful");
            }
            dispatch({type: "setOptionContractTickerList", payload: data.list});
        } else {
            alert("Option contract is already existed");
        }
    };

    async function handleOptionContractRemove(currentOptionContractTicker) {
        const {data} = await axios.delete("/option_contract/remove_option_contract/", { data:{ "optionChainSymbol": currentOptionContractTicker }})

        if (data.success != true) {
            alert("Remove option contract failed");
        } else {
            alert("Remove option contract successful");
        }
        dispatch({type: "setOptionContractTickerList", payload: data.list});
    }

    const handleSetStockName = (currentOptionContractTicker) => {
        dispatch({type: "handleSetStockName", payload: currentOptionContractTicker});
    }

    useEffect( () => {
        option_contract_list_fetch();
    }, [optionContractTickerListLength]);

    
    return (
        <div className="flex flex-col justify-between">
            <div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="optionContractTicker">Option Contract List</label>
                    <div className="flex gap-5">
                        <input
                            type="text"
                            id="optionContractTicker"
                            value={optionContractTicker}
                            onInput={(event) => dispatch({type: "setOptionContractTicker", payload: (event.target.value).toUpperCase()})}
                        />
                        <button className="inline-block rounded bg-teal-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]" type="button" onClick={handleOptionContractAdd}>
                            <span>Add</span>
                        </button>
                    </div>
                </div>
                <div className="overflow-scroll">
                    {optionContractTickerList.map((currentOptionContractTicker, index) => (
                        <div key={index} className="option contracts">
                            <div className="flex justify-between gap-5">
                                <button
                                    className="inline-block rounded bg-grey-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                    onClick={() => handleSetStockName(currentOptionContractTicker)}
                                >
                                    {currentOptionContractTicker}
                                </button>
                                <button
                                    className="inline-block rounded bg-red-300 px-2 py-1 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                    onClick={() => handleOptionContractRemove(currentOptionContractTicker)} 
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
    )
};
