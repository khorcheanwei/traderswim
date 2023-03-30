import axios from "axios";
import { createContext, useEffect } from "react";
import { Link , Navigate} from 'react-router-dom';
import { useState} from 'react';
import { useCookies } from "react-cookie";

export const CopyTradingAccountContext = createContext({});

export function CopyTradingAccountContextProvider({children}) {
    const [copyTradingAccountData, setCopyTradingAccountData] = useState([]);
    const [rowCopyTradingAccount, setRowCopyTradingAccount] = useState([]);

    const [masterAccountList, setMasterAccountList] = useState([]);
    const [copierAccountList, setCopierAccountList] = useState([]);

    const [isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful] =  useState(false);
    const [isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete] = useState(false);

    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    
    return (
        <CopyTradingAccountContext.Provider value={{copyTradingAccountData, setCopyTradingAccountData, rowCopyTradingAccount, setRowCopyTradingAccount, masterAccountList, setMasterAccountList, copierAccountList, setCopierAccountList, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful, isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete, isOpenTradingStock, setIsOpenTradingStock}}>
            {children}
        </CopyTradingAccountContext.Provider>
    );
}