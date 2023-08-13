import { createContext, useContext, useReducer } from "react";
import { useState} from 'react';

export const OptionContractPlaceOrderContext = createContext({});

var optionChainInstructionList = ["BUY_TO_OPEN", "SELL_TO_CLOSE"];
//var optionChainCallPutList = ["CALL", "PUT"];
var optionChainOrderTypeList = ["LIMIT", "MARKET", "MARKET_ON_CLOSE", "STOP", "STOP_LIMIT", "TRAILING_STOP"];

const optionContractPlaceOrderState = {
    isLoading: false,
    stockName: "",
    isOptionChainCall: false,
    isOptionChainPut: false,
    optionChainData: [],
    optionChainDateList: [],
    optionChainDate: "None",
    optionChainStrikeList: [],
    optionChainDescription: "None",
    refreshOptionChainStrikeListKey: 0,
    optionChainSymbol: "",
    optionChainInstruction: optionChainInstructionList[0],
    optionChainOrderType: "LIMIT",
    optionChainQuantity: 1,
    optionChainPrice: 0,
    optionContractTicker: "",
    optionContractTickerList: []
}

function reducer(state, action) {
    switch(action.type) {
        case "setOptionContractTickerList":
            return {
                ...state,
                optionContractTicker: "",
                optionContractTickerList: action.payload,
            };
        case "setStockName":
            return {
                ...state,
                stockName: action.payload,
            }
        case "handleSetStockName":
            return {
                ...state,
                stockName: action.payload,
                isOptionChainCall: false,
                isOptionChainPut: false,
                optionChainData: [],
                optionChainDateList: [],
                optionChainDate: "None",
                optionChainStrikeList: [],
                optionChainDescription: "None",
                optionChainSymbol: "",
                optionChainInstruction: optionChainInstructionList[0],
                optionChainOrderType: "LIMIT",
                optionChainQuantity: 1,
                optionChainPrice: 0,
            };
        case "setOptionContractTicker":
            return {
                ...state,
                optionContractTicker: action.payload,
            };
        case "getBeforeOptionChainList":
            return {
                ...state,
                isLoading: true,
                refreshOptionChainStrikeListKey: state.refreshOptionChainStrikeListKey + 1,
                optionChainDateList: [],
                optionChainStrikeList: [],
                optionChainDescription: "None",
                optionChainPrice: 0,
            }
        case "getAfterOptionChainList":
            // set first option chain data when user get new option chain list
            let option_chain_data = action.payload;
            let first_option_chain_date = Object.keys(option_chain_data)[0];
            let first_option_chain_strike_list = Object.keys(option_chain_data[first_option_chain_date]);
            return {
                ...state,
                optionChainData: option_chain_data,
                optionChainDate: first_option_chain_date,
                optionChainDateList: Object.keys(option_chain_data),
                optionChainStrikeList: Object.keys(option_chain_data[first_option_chain_date]),
                optionChainDescription: option_chain_data[first_option_chain_date][first_option_chain_strike_list[0]][0]["description"],
                optionChainSymbol: option_chain_data[first_option_chain_date][first_option_chain_strike_list[0]][0]["symbol"],
                optionChainPrice: option_chain_data[first_option_chain_date][first_option_chain_strike_list[0]][0]["bid"],
            }
        case "setIsLoadingFalse":
            return {
                ...state,
                isLoading: false,
            }
        case "getOptionChainStrikeList":
            let option_chain_date = action.payload;
            first_option_chain_strike_list = Object.keys(state.optionChainData[option_chain_date]);
            return {
                ...state,
                optionChainDate: option_chain_date,
                optionChainStrikeList: Object.keys(state.optionChainData[option_chain_date]),
                optionChainDescription: state.optionChainData[option_chain_date][first_option_chain_strike_list[0]][0]["description"],
                optionChainSymbol: state.optionChainData[option_chain_date][first_option_chain_strike_list[0]][0]["symbol"],
                optionChainPrice: state.optionChainData[option_chain_date][first_option_chain_strike_list[0]][0]["bid"],
            }
        case "getOptionChainBidPrice":
            let option_chain_strike = action.payload;
            return {
                ...state,
                optionChainDescription: state.optionChainData[state.optionChainDate][option_chain_strike][0]["description"],
                optionChainPrice: state.optionChainData[state.optionChainDate][option_chain_strike][0]["bid"],
                optionChainSymbol: state.optionChainData[state.optionChainDate][option_chain_strike][0]["symbol"],
            }
        case "handleIsOptionChainCall":
            return {
                ...state,
                isOptionChainCall: true,
                isOptionChainPut: false,
            }
        case "handleIsOptionChainPut":
            return {
                ...state,
                isOptionChainCall: false,
                isOptionChainPut: true,
            }
        case "setOptionChainInstruction":
            return {
                ...state,
                optionChainInstruction: action.payload,
            }
        case "setOptionChainOrderType":
            return {
                ...state,
                optionChainOrderType: action.payload,
            }
        case "setOptionChainQuantity":
            return {
                ...state,
                optionChainQuantity: action.payload,
            }
        case "setOptionChainPrice":
            return {
                ...state,
                optionChainPrice: action.payload,
            }
        default:
            throw new Error("Action unknown");
    }
}



function OptionContractPlaceOrderContextProvider({children}) {
    const [{isLoading, stockName, isOptionChainCall, isOptionChainPut, optionChainData, optionChainDateList, 
        optionChainDate, optionChainStrikeList, optionChainDescription, refreshOptionChainStrikeListKey, optionChainSymbol, 
        optionChainInstruction, optionChainOrderType, optionChainQuantity, optionChainPrice, optionContractTicker, optionContractTickerList}, 
        dispatch] = useReducer(reducer, optionContractPlaceOrderState);
    
    return (
        <OptionContractPlaceOrderContext.Provider value={{ 
            isLoading,
            stockName, 
            isOptionChainCall, 
            isOptionChainPut,
            optionChainData, 
            optionChainDateList, 
            optionChainDate, 
            optionChainStrikeList, 
            optionChainDescription, 
            refreshOptionChainStrikeListKey, 
            optionChainSymbol, 
            optionChainInstruction, 
            optionChainOrderType, 
            optionChainQuantity, 
            optionChainPrice, 
            optionContractTicker, 
            optionContractTickerList,
            dispatch
        }}>
            {children}
        </OptionContractPlaceOrderContext.Provider>
    );
}

function useOptionContractPlaceOrderContext() {
    const context = useContext(OptionContractPlaceOrderContext);
    if (context === undefined)
      throw new Error("OptionContractPlaceOrderContext was used outside the OptionContractPlaceOrderContext.Provider");
    return context;
}

export {OptionContractPlaceOrderContextProvider, useOptionContractPlaceOrderContext}