import { createContext } from "react";
import { useState} from 'react';

export const TradeHistoryContext = createContext({});

export function TradeHistoryContextProvider({children}) {
    const [tradeHistoryTableData, setTradeHistoryTableData] = useState([]);

    return (
        <TradeHistoryContext.Provider value={{tradeHistoryTableData, setTradeHistoryTableData}}>
            {children}
        </TradeHistoryContext.Provider>
    );
}