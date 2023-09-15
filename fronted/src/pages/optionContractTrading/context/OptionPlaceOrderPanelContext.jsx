import { createContext } from "react";
import { useState } from "react";

export const OptionPlaceOrderPanelContext = createContext({});

export function OptionPlaceOrderPanelContextProvider({ children }) {
  const [optionContractSaveOrderList, setOptionContractSaveOrderList] =
    useState([]);

  return (
    <OptionPlaceOrderPanelContext.Provider
      value={{ optionContractSaveOrderList, setOptionContractSaveOrderList }}
    >
      {children}
    </OptionPlaceOrderPanelContext.Provider>
  );
}
