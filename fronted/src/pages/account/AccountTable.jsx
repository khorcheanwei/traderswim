import React from 'react'
import {  useAsyncDebounce} from 'react-table'
import { Button,} from '../shared/Button'
import { useContext } from 'react';
import AccountAdd from './AccountAdd';
import AccountInfo from './AccountInfo'
import AccountDeleteConfirmation from './AccountDeleteConfirmation'
import { AccountContext } from '../context/AccountContext';
import CommonTable from '../shared/Table';

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


  const accountAddClose = () => {
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
        <Button className="text-gray-700 " onClick={accountAddClose}>ADD ACCOUNT</Button>
      </div>
      <div>
        <Overlay isOpen={isOpenAccountLogin}>
          <AccountAdd onClose={accountAddClose}></AccountAdd>
        </Overlay>
      </div>
    </div>
  )
}

export function ConnectionPanel(row) {

  /*
  for (let i = 0; i < row.data.length; i++) {
    console.log(row.data[i])
  } */
  const accountConnection = row.cell.row.original.accountConnection;

  return (
    <div>
      {accountConnection
        ? <span className='bg-green-500 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300'></span>
        : <span className='bg-red-500 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300'></span>
      }
    </div>
  );
};

export function SettingsPanel(row) {

  const { isOpenAccountDelete, setIsOpenAccountDelete, isShowAccountInfo, setIsShowAccountInfo } = useContext(AccountContext);
  
  const { rowAccount, setRowAccount } = useContext(AccountContext);

  const accountInfoClose = () => {

    if (isShowAccountInfo == false) {
      setRowAccount(row)
    }
    setIsShowAccountInfo(!isShowAccountInfo);
  };


  const accountDeleteClose = () => {

    if (isOpenAccountDelete == false) {
      setRowAccount(row)
    }
    setIsOpenAccountDelete(!isOpenAccountDelete);
  };
  

  return (
    <div className="flex">
      <svg onClick={accountInfoClose} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <svg onClick={accountDeleteClose} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-2 cursor-pointer">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
      <Overlay isOpen={isShowAccountInfo} >
        <AccountInfo rowAccount={rowAccount} onClose={accountInfoClose}></AccountInfo>
      </Overlay>
      <Overlay isOpen={isOpenAccountDelete} >
        <AccountDeleteConfirmation rowAccount={rowAccount} onClose={accountDeleteClose}></AccountDeleteConfirmation>
      </Overlay>
    </div>
  );
};

function AccountsTable({ columns, data }) {
  return CommonTable({ columns, data, GlobalFilter })
}

export default AccountsTable;