import { createContext} from "react";
import { useState} from 'react';

export const StockPlaceOrderPanelContext = createContext({});

export function StockPlaceOrderPanelContextProvider({children}) {
    const [optionContractSaveOrderList, setOptionContractSaveOrderList] = useState([]);
    
    return (
        <StockPlaceOrderPanelContext.Provider value={{ optionContractSaveOrderList, setOptionContractSaveOrderList}}>
            {children}
        </StockPlaceOrderPanelContext.Provider>
    );
}