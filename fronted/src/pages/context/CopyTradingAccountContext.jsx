import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
    const [copyTradingAccountData, setCopyTradingAccountData] = useState([]);
    const [rowCopyTradingAccount, setRowCopyTradingAccount] = useState([]);

    const [isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful] =  useState(false);

    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{copyTradingAccountData, setCopyTradingAccountData, rowCopyTradingAccount, setRowCopyTradingAccount, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful,  isOpenTradingStock, setIsOpenTradingStock}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}