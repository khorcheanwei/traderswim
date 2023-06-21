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

    const [isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual] = useState(false);
    const [isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual] = useState(false); 
    const [rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual] = useState([]);
    
    return (
        <CopyTradingOrderContext.Provider value={{ copyTradingOrderDataDict, setCopyTradingOrderDataDict, 
            copyTradingOrderMainData, setCopyTradingOrderMainData, rowCopyTradingOrder, setRowCopyTradingOrder, 
            isOpenViewAllOrder, setIsOpenViewAllOrder, isOpenTradingStock, setIsOpenTradingStock, 
            isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete, 
            isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual,
            isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual,
            rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual
        }}>
            {children}
        </CopyTradingOrderContext.Provider>
    );
}