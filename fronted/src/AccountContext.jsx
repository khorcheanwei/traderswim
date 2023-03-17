import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const AccountContext = createContext({});

export function AccountContextProvider({children}) {
    const [isAccountLoginSuccessful, setIsAccountLoginSuccessful] = useState(false);
 
    return (
        <AccountContext.Provider value={{isAccountLoginSuccessful, setIsAccountLoginSuccessful}}>
            {children}
        </AccountContext.Provider>
    );
}