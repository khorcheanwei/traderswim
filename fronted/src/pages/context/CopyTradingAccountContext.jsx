import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
   
    const [rowCopyTradingAccount, setRowCopyTradingAccount] = useState([]);

    const [isOpenViewAllOrders, setIsOpenViewAllOrders] = useState(false);
    
    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    const [isOpenOrderExit, setIsOpenOrderExit] = useState(false);
    const [isOpenOrderReplace, setIsOpenOrderReplace] = useState(false);
    const [isOpenOrderDelete, setIsOpenOrderDelete] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{ rowCopyTradingAccount, setRowCopyTradingAccount, isOpenViewAllOrders, setIsOpenViewAllOrders, isOpenTradingStock, setIsOpenTradingStock, isOpenOrderExit, setIsOpenOrderExit, isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}