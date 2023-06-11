import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingPositionContext = createContext({});

export function CopyTradingPositionContextProvider({children}) {
    const [copyTradingPositionAccountDataDict, setCopyTradingPositionAccountDataDict] = useState({});
    const [copyTradingPositionMainAccountData, setCopyTradingPositionMainAccountData] = useState([]);
   
    const [rowCopyTradingPosition, setRowCopyTradingPosition] = useState([]);

    const [isOpenViewAllPosition, setIsOpenViewAllPosition] = useState(false);

    const [isCopyTradingPositionSuccessful, setIsCopyTradingPositionSuccessful] =  useState(false);
    const [isOpenCopyTradingPositionDelete, setIsOpenCopyTradingPositionDelete] = useState(false);

    const [isOpenOrderExit, setIsOpenOrderExit] = useState(false);
    
    return (
        <CopyTradingPositionContext.Provider value={{ copyTradingPositionAccountDataDict, setCopyTradingPositionAccountDataDict, copyTradingPositionMainAccountData, setCopyTradingPositionMainAccountData, rowCopyTradingPosition, setRowCopyTradingPosition, isOpenViewAllPosition, setIsOpenViewAllPosition, isCopyTradingPositionSuccessful, setIsCopyTradingPositionSuccessful,  isOpenCopyTradingPositionDelete, setIsOpenCopyTradingPositionDelete, isOpenOrderExit, setIsOpenOrderExit}}>
            {children}
        </CopyTradingPositionContext.Provider>
    );
}