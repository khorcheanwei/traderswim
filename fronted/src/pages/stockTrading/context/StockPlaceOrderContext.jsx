import { createContext} from "react";
import { useState} from 'react';

export const StockPlaceOrderContext = createContext({});

export function StockPlaceOrderContextProvider({children}) {
    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    
    return (
        <StockPlaceOrderContext.Provider value={{ isOpenTradingStock, setIsOpenTradingStock}}>
            {children}
        </StockPlaceOrderContext.Provider>
    );
}