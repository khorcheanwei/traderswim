import { createContext} from "react";
import { useState} from 'react';

export const OptionContractPlaceOrderContext = createContext({});

export function OptionContractPlaceOrderContextProvider({children}) {
    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    
    return (
        <OptionContractPlaceOrderContext.Provider value={{ isOpenTradingStock, setIsOpenTradingStock}}>
            {children}
        </OptionContractPlaceOrderContext.Provider>
    );
}