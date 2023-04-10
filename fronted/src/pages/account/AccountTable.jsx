import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import { Button, PageButton } from '../shared/Button'
import { classNames } from '../shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from '../shared/Icons'
import {useContext, useState, useEffect} from 'react';
import AccountAdd from './AccountAdd';
import AccountDeleteConfirmation from './AccountDeleteConfirmation'
import { AccountContext } from '../context/AccountContext';
import CommonTable from '../shared/Table';

import axios from 'axios';
import Overlay from "../Overlay";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  const { isOpenAccountLogin, setIsOpenAccountLogin } = useContext(AccountContext);


  const toggleOverlay = () => {
    setIsOpenAccountLogin(!isOpenAccountLogin);
  };



  return (
      <div className="w-full">
        <div className="flex justify-between">
          <label className="flex gap-x-2 items-baseline">
            <span className="text-gray-700">Search: </span>
            <input
              type="text"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} records...`}
            />
          </label>
          <Button className="text-gray-700 " onClick={toggleOverlay}>ADD ACCOUNT</Button>
        </div>
        <div>
          <Overlay isOpen={isOpenAccountLogin} onClose={toggleOverlay}>
            <AccountAdd></AccountAdd>
          </Overlay>
        </div>
      </div>
  )
}

export function StatusPill(row) {

  var accountStatus = "offline";
  if (row.value == true) {
    accountStatus = "online";
  } 

  return (
    <span
      className={
        classNames(
          "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
          accountStatus.startsWith("online") ? "bg-green-100 text-green-800" : null,
          accountStatus.startsWith("offline") ? "bg-red-100 text-red-800" : null,
        )
      }
    >
      {accountStatus}
    </span>
  );
};



export function SettingsPanel(row) {

  const { isOpenAccountDelete, setIsOpenAccountDelete} = useContext(AccountContext);
  const {rowAccount, setRowAccount} = useContext(AccountContext);

  const toggleOverlay = () => {
    
    if (isOpenAccountDelete == false) {
      setRowAccount(row)
    }
    setIsOpenAccountDelete(!isOpenAccountDelete);
  };

  return (
    <div className="flex">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <svg onClick={toggleOverlay} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      <Overlay isOpen={isOpenAccountDelete} onClose={toggleOverlay}>
          <AccountDeleteConfirmation rowAccount={rowAccount}></AccountDeleteConfirmation>
      </Overlay>
    </div>
  );
};




export function ConnectionToggle(row) {
  const { accountTableData, setAccountTableData, isAccountLoginSuccessful, setIsAccountLoginSuccessful} = useContext(AccountContext);

  var checked_state = false;

  if (row.value == true) {
    checked_state = true
  }

  async function updateAccountConnection(accountName, accountConnection) {
    try {
      // trigger connection ON/OFF to account trading session
      await axios.post("/trading_account/connection", {accountName, accountConnection})
      var response = await axios.get("/trading_account/database")
      if (response.data != null) {
        setAccountTableData(response.data)
      }

    } catch (error) {
      console.error(error);
    }
  }

  function handleConnectionChange() {
    var accountName = row.cell.row.original.accountName
    updateAccountConnection(accountName, !checked_state)
  }

  return (
    <label className="relative inline-flex content-center">
      <input type="checkbox" value="" className="sr-only peer" checked={checked_state} onChange={handleConnectionChange}></input>
      <div className="w-11 h-6 cursor-pointer bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-800"></div>
    </label>
  );
};

function AccountsTable({ columns, data}) {
  return CommonTable({columns, data, GlobalFilter})
}

export default AccountsTable;