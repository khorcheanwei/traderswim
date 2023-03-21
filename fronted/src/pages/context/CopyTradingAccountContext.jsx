import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
    const [copyTradingAccountData, setCopyTradingAccountData] = useState([]);

    const [isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful] =  useState(false);
    const [isOpenCopyTradingAccount, setIsOpenCopyTradingAccount] = useState(false);
    const [isOpenCopyTradingWarning, setIsOpenCopyTradingWarning] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{copyTradingAccountData, setCopyTradingAccountData, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful, isOpenCopyTradingAccount, setIsOpenCopyTradingAccount,isOpenCopyTradingWarning, setIsOpenCopyTradingWarning}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}