import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const AccountContext = createContext({});

export function AccountContextProvider({children}) {
    const [accountTableData, setAccountTableData] = useState([]);
    const [rowAccount, setRowAccount] = useState([])

    const [isAccountLoginSuccessful, setIsAccountLoginSuccessful] = useState(false);
    const [isOpenAccountLogin, setIsOpenAccountLogin] = useState(false);
    const [isOpenAccountDelete, setIsOpenAccountDelete] = useState(false);
    
    return (
        <AccountContext.Provider value={{rowAccount, setRowAccount, accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful,  isOpenAccountLogin, setIsOpenAccountLogin, isOpenAccountDelete, setIsOpenAccountDelete}}>
            {children}
        </AccountContext.Provider>
    );
}