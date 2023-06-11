import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingOrderContext = createContext({});

export function CopyTradingOrderContextProvider({children}) {
    const [copyTradingOrderDataDict, setCopyTradingOrderDataDict] = useState({});
    const [copyTradingOrderMainData, setCopyTradingOrderMainData] = useState([]);

    const [rowCopyTradingOrder, setRowCopyTradingOrder] = useState([]);

    const [isOpenViewAllOrder, setIsOpenViewAllOrder] = useState(false);
    
    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    const [isOpenOrderReplace, setIsOpenOrderReplace] = useState(false);
    const [isOpenOrderDelete, setIsOpenOrderDelete] = useState(false);
    
    return (
        <CopyTradingOrderContext.Provider value={{ copyTradingOrderDataDict, setCopyTradingOrderDataDict, copyTradingOrderMainData, setCopyTradingOrderMainData, rowCopyTradingOrder, setRowCopyTradingOrder, isOpenViewAllOrder, setIsOpenViewAllOrder, isOpenTradingStock, setIsOpenTradingStock, isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete}}>
            {children}
        </CopyTradingOrderContext.Provider>
    );
}