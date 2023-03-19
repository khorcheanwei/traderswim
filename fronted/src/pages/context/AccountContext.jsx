import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const AccountContext = createContext({});

export function AccountContextProvider({children}) {
    var [accountTableData, setAccountTableData] = useState([]);
    var [accountNameListData, setAccountNameListData] = useState([]);
    const [isAccountLoginSuccessful, setIsAccountLoginSuccessful] = useState(false);
    const [isOpenAccountLogin, setIsOpenAccountLogin] = useState(false);
    const [isOpenCopyTradingAccount, setIsOpenCopyTradingAccount] = useState(false);
    const [isOpenCopyTradingWarning, setIsOpenCopyTradingWarning] = useState(false);
    
    return (
        <AccountContext.Provider value={{accountTableData, setAccountTableData, accountNameListData, setAccountNameListData, isAccountLoginSuccessful, setIsAccountLoginSuccessful,  isOpenAccountLogin, setIsOpenAccountLogin, isOpenCopyTradingAccount, setIsOpenCopyTradingAccount,isOpenCopyTradingWarning, setIsOpenCopyTradingWarning}}>
            {children}
        </AccountContext.Provider>
    );
}