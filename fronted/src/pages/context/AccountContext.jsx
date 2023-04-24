import { createContext } from "react";
import { useState} from 'react';

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