import { createContext} from "react";
import { useState} from 'react';

export const StockPlaceOrderPanelContext = createContext({});

export function StockPlaceOrderPanelContextProvider({children}) {
    const [stockSaveOrderList, setStockSaveOrderList] = useState([]);
    
    return (
        <StockPlaceOrderPanelContext.Provider value={{ stockSaveOrderList, setStockSaveOrderList}}>
            {children}
        </StockPlaceOrderPanelContext.Provider>
    );
}