import { createContext} from "react";
import { useState} from 'react';

export const CopyTradingOrderContext = createContext({});

export function CopyTradingOrderContextProvider({children}) {
    const [copyTradingOrderDataDict, setCopyTradingOrderDataDict] = useState({});
    const [copyTradingOrderMainData, setCopyTradingOrderMainData] = useState([]);

    const [rowCopyTradingOrder, setRowCopyTradingOrder] = useState([]);

    const [isOpenViewAllOrder, setIsOpenViewAllOrder] = useState(false);

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
            isOpenViewAllOrder, setIsOpenViewAllOrder,
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