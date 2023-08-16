import { createContext} from "react";
import { useState} from 'react';

export const StockCopyTradingPositionContext = createContext({});

export function StockCopyTradingPositionContextProvider({children}) {
    const [copyTradingPositionDataDict, setCopyTradingPositionDataDict] = useState({});
    const [copyTradingPositionMainData, setCopyTradingPositionMainData] = useState([]);
   
    const [rowCopyTradingPosition, setRowCopyTradingPosition] = useState([]);

    const [isOpenViewAllPosition, setIsOpenViewAllPosition] = useState(false);

    const [isOpenOrderExit, setIsOpenOrderExit] = useState(false);
    
    return (
        <StockCopyTradingPositionContext.Provider value={{ copyTradingPositionDataDict, setCopyTradingPositionDataDict, copyTradingPositionMainData, setCopyTradingPositionMainData, rowCopyTradingPosition, setRowCopyTradingPosition, isOpenViewAllPosition, setIsOpenViewAllPosition, isOpenOrderExit, setIsOpenOrderExit}}>
            {children}
        </StockCopyTradingPositionContext.Provider>
    );
}