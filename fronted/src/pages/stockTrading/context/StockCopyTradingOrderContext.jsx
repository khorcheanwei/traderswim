import { createContext } from "react";
import { useState } from "react";

export const StockCopyTradingOrderContext = createContext({});

export function StockCopyTradingOrderContextProvider({ children }) {
  const [stockCopyTradingOrderDataDict, setStockCopyTradingOrderDataDict] =
    useState({});
  const [stockCopyTradingOrderMainData, setStockCopyTradingOrderMainData] =
    useState([]);

  const [rowCopyTradingOrder, setRowCopyTradingOrder] = useState([]);

  const [isOpenViewAllOrder, setIsOpenViewAllOrder] = useState(false);

  const [isOpenOrderReplaceIndividual, setIsOpenOrderReplaceIndividual] =
    useState(false);
  const [isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual] =
    useState(false);
  const [rowCopyTradingOrderIndividual, setRowCopyTradingOrderIndividual] =
    useState([]);

  const [rowCopyTradingOrderSelected, setRowCopyTradingOrderSelected] =
    useState([]);

  return (
    <StockCopyTradingOrderContext.Provider
      value={{
        stockCopyTradingOrderDataDict,
        setStockCopyTradingOrderDataDict,
        stockCopyTradingOrderMainData,
        setStockCopyTradingOrderMainData,
        rowCopyTradingOrder,
        setRowCopyTradingOrder,
        isOpenViewAllOrder,
        setIsOpenViewAllOrder,
        isOpenOrderReplaceIndividual,
        setIsOpenOrderReplaceIndividual,
        isOpenOrderDeleteIndividual,
        setIsOpenOrderDeleteIndividual,
        rowCopyTradingOrderIndividual,
        setRowCopyTradingOrderIndividual,
        rowCopyTradingOrderSelected,
        setRowCopyTradingOrderSelected,
      }}
    >
      {children}
    </StockCopyTradingOrderContext.Provider>
  );
}
