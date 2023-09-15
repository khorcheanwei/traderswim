import { createContext } from "react";
import { useState } from "react";

export const AccountContext = createContext({});

export function AccountContextProvider({ children }) {
  const [accountTableData, setAccountTableData] = useState([]);
  const [rowAccount, setRowAccount] = useState([]);

  const [isOpenAccountLogin, setIsOpenAccountLogin] = useState(false);
  const [isOpenAccountDelete, setIsOpenAccountDelete] = useState(false);
  const [isShowAccountInfo, setIsShowAccountInfo] = useState(false);

  return (
    <AccountContext.Provider
      value={{
        rowAccount,
        setRowAccount,
        accountTableData,
        setAccountTableData,
        isOpenAccountLogin,
        setIsOpenAccountLogin,
        isOpenAccountDelete,
        setIsOpenAccountDelete,
        isShowAccountInfo,
        setIsShowAccountInfo,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
