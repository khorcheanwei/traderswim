import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const AccountContext = createContext({});

export function AccountContextProvider({children}) {
    const [accountTableData, setAccountTableData] = useState([]);
    
    const [isAccountLoginSuccessful, setIsAccountLoginSuccessful] = useState(false);
    const [isOpenAccountLogin, setIsOpenAccountLogin] = useState(false);
    
    return (
        <AccountContext.Provider value={{accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful,  isOpenAccountLogin, setIsOpenAccountLogin}}>
            {children}
        </AccountContext.Provider>
    );
}