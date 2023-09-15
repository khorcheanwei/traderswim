import { createContext } from "react";
import { useState } from "react";

export const StockTradeHistoryContext = createContext({});

export function StockTradeHistoryContextProvider({ children }) {
  const [stockTradeHistoryTableData, setStockTradeHistoryTableData] = useState(
    [],
  );

  return (
    <StockTradeHistoryContext.Provider
      value={{ stockTradeHistoryTableData, setStockTradeHistoryTableData }}
    >
      {children}
    </StockTradeHistoryContext.Provider>
  );
}
