import { createContext } from "react";
import { useState } from "react";

export const CopyTradingPositionContext = createContext({});

export function CopyTradingPositionContextProvider({ children }) {
  const [copyTradingPositionDataDict, setCopyTradingPositionDataDict] =
    useState({});
  const [copyTradingPositionMainData, setCopyTradingPositionMainData] =
    useState([]);

  const [rowCopyTradingPosition, setRowCopyTradingPosition] = useState([]);

  const [isOpenViewAllPosition, setIsOpenViewAllPosition] = useState(false);

  const [isOpenOrderExit, setIsOpenOrderExit] = useState(false);

  return (
    <CopyTradingPositionContext.Provider
      value={{
        copyTradingPositionDataDict,
        setCopyTradingPositionDataDict,
        copyTradingPositionMainData,
        setCopyTradingPositionMainData,
        rowCopyTradingPosition,
        setRowCopyTradingPosition,
        isOpenViewAllPosition,
        setIsOpenViewAllPosition,
        isOpenOrderExit,
        setIsOpenOrderExit,
      }}
    >
      {children}
    </CopyTradingPositionContext.Provider>
  );
}
