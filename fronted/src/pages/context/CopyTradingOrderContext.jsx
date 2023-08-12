import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingOrderContext = createContext({});

export function CopyTradingOrderContextProvider({children}) {
    const [copyTradingOrderDataDict, setCopyTradingOrderDataDict] = useState({});
    const [copyTradingOrderMainData, setCopyTradingOrderMainData] = useState([]);

    const [rowCopyTradingOrder, setRowCopyTradingOrder] = useState([]);

    const [isOpenViewAllOrder, setIsOpenViewAllOrder] = useState(false);
    
    const [isOpenTradingStock, setIsOpenTradingStock] = useState(false);
    const [isOpenOrderPlace, setIsOpenOrderPlace] = useState(false);
    const [isOpenOrderReplace, setIsOpenOrderReplace] = useState(false);
    const [isOpenOrderDelete, setIsOpenOrderDelete] = useState(false);

    const [isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual] = useState(false);
    const [isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual] = useState(false); 
    const [rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual] = useState([]);

    const [isOpenOrderReplaceSelected, setIsOpenOrderReplaceSelected] = useState(false);
    const [isOpenOrderDeleteSelected, setIsOpenOrderDeleteSelected] = useState(false); 
    const [isOpenWarningMessageOrderSelected, setIsOpenWarningMessageOrderSelected] = useState(false); 
    const [rowCopyTradingOrderSelected, setRowCopyTradingOrderSelected] = useState([]);
    
    return (
        <CopyTradingOrderContext.Provider value={{ copyTradingOrderDataDict, setCopyTradingOrderDataDict, 
            copyTradingOrderMainData, setCopyTradingOrderMainData, rowCopyTradingOrder, setRowCopyTradingOrder, 
            isOpenViewAllOrder, setIsOpenViewAllOrder, isOpenTradingStock, setIsOpenTradingStock, 
            isOpenOrderPlace, setIsOpenOrderPlace, isOpenOrderReplace, setIsOpenOrderReplace, isOpenOrderDelete, setIsOpenOrderDelete, 
            isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual,
            isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual,
            rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual,
            isOpenOrderReplaceSelected, setIsOpenOrderReplaceSelected,
            isOpenOrderDeleteSelected, setIsOpenOrderDeleteSelected,
            isOpenWarningMessageOrderSelected, setIsOpenWarningMessageOrderSelected,
            rowCopyTradingOrderSelected, setRowCopyTradingOrderSelected
        }}>
            {children}
        </CopyTradingOrderContext.Provider>
    );
}