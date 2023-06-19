import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
    const [copyTradingAccountDataDict, setCopyTradingAccountDataDict] = useState({});
    const [copyTradingMainAccountData, setCopyTradingMainAccountData] = useState([]);

    const [rowCopyTradingAccount, setRowCopyTradingAccount] = useState([]);

    const [isOpenViewAllOrders, setIsOpenViewAllOrders] = useState(false);
    
    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    const [isOpenOrderReplace, setIsOpenOrderReplace] = useState(false);
    const [isOpenOrderDelete, setIsOpenOrderDelete] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{ copyTradingAccountDataDict, setCopyTradingAccountDataDict, copyTradingMainAccountData, setCopyTradingMainAccountData, rowCopyTradingAccount, setRowCopyTradingAccount, isOpenViewAllOrders, setIsOpenViewAllOrders, isOpenTradingStock, setIsOpenTradingStock, isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}