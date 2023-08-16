import { createContext } from "react";
import { useState} from 'react';

export const StockTradeHistoryContext = createContext({});

export function StockTradeHistoryContextProvider({children}) {
    const [tradeHistoryTableData, setTradeHistoryTableData] = useState([]);

    return (
        <StockTradeHistoryContext.Provider value={{tradeHistoryTableData, setTradeHistoryTableData}}>
            {children}
        </StockTradeHistoryContext.Provider>
    );
}