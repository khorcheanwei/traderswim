import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
   
    const [rowCopyTradingAccount, setRowCopyTradingAccount] = useState([]);

    const [isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful] =  useState(false);
    const [isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete] = useState(false);

    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    const [isOpenOrderReplace, setIsOpenOrderReplace] = useState(false);
    const [isOpenOrderDelete, setIsOpenOrderDelete] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{ rowCopyTradingAccount, setRowCopyTradingAccount, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful,  isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete, isOpenTradingStock, setIsOpenTradingStock, isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}