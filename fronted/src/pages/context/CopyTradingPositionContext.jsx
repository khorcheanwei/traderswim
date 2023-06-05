import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingPositionContext = createContext({});

export function CopyTradingPositionContextProvider({children}) {
   
    const [rowCopyTradingPosition, setRowCopyTradingPosition] = useState([]);

    const [isCopyTradingPositionSuccessful, setIsCopyTradingPositionSuccessful] =  useState(false);
    const [isOpenCopyTradingPositionDelete, setIsOpenCopyTradingPositionDelete] = useState(false);

    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    
    return (
        <CopyTradingPositionContext.Provider value={{ rowCopyTradingPosition, setRowCopyTradingPosition, isCopyTradingPositionSuccessful, setIsCopyTradingPositionSuccessful,  isOpenCopyTradingPositionDelete, setIsOpenCopyTradingPositionDelete, isOpenTradingStock, setIsOpenTradingStock}}>
            {children}
        </CopyTradingPositionContext.Provider>
    );
}