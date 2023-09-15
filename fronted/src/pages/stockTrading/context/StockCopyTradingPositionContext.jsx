import { createContext } from "react";
import { useState } from "react";

export const StockCopyTradingPositionContext = createContext({});

export function StockCopyTradingPositionContextProvider({ children }) {
  const [
    stockCopyTradingPositionDataDict,
    setStockCopyTradingPositionDataDict,
  ] = useState({});
  const [
    stockCopyTradingPositionMainData,
    setStockCopyTradingPositionMainData,
  ] = useState([]);

  const [rowCopyTradingPosition, setRowCopyTradingPosition] = useState([]);

  const [isOpenViewAllPosition, setIsOpenViewAllPosition] = useState(false);
  return (
    <StockCopyTradingPositionContext.Provider
      value={{
        stockCopyTradingPositionDataDict,
        setStockCopyTradingPositionDataDict,
        stockCopyTradingPositionMainData,
        setStockCopyTradingPositionMainData,
        rowCopyTradingPosition,
        setRowCopyTradingPosition,
        isOpenViewAllPosition,
        setIsOpenViewAllPosition,
      }}
    >
      {children}
    </StockCopyTradingPositionContext.Provider>
  );
}
