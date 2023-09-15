import { createContext } from "react";
import { useState } from "react";

export const TradeStockContext = createContext({});

export function TradeStockContextProvider({ children }) {
  const [stockNameID, setStockNameID] = useState("");

  return (
    <TradeStockContext.Provider value={{ stockNameID, setStockNameID }}>
      {children}
    </TradeStockContext.Provider>
  );
}
