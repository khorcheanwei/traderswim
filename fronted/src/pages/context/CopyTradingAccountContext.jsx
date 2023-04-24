import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
    const [copyTradingAccountData, setCopyTradingAccountData] = useState([]);
    const [rowCopyTradingAccount, setRowCopyTradingAccount] = useState([]);

    const [isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful] =  useState(false);
    const [isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete] = useState(false);

    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{copyTradingAccountData, setCopyTradingAccountData, rowCopyTradingAccount, setRowCopyTradingAccount, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful,  isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete, isOpenTradingStock, setIsOpenTradingStock}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}