import { createContext } from "react";
import { useState} from 'react';

export const StockTradeContext = createContext({});

export function StockTradeContextProvider({children}) {
    const [stockNameID, setStockNameID] = useState("");

    return (
        <StockTradeContext.Provider value={{stockNameID, setStockNameID}}>
            {children}
        </StockTradeContext.Provider>
    );
}