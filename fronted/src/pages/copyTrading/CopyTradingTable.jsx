import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import { Button, PageButton } from './../shared/Button'
import { classNames } from './../shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from './../shared/Icons'
import {useContext, useState, useEffect} from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';
import CopyTradingAccountDeleteConfirmation from './CopyTradingPlaceNewOrder';
import TradingStock from '../tradingStock/TradingStock';

import axios from 'axios';
import Overlay from "./../Overlay";
import { async } from 'regenerator-runtime'

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

  const { masterAccountList, setMasterAccountList, copierAccountList, setCopierAccountList } = useContext(CopyTradingAccountContext);
  const { isOpenTradingStock, setIsOpenTradingStock } = useContext(CopyTradingAccountContext);


  const toggleTradingStockOverlay = async () => {
    setIsOpenTradingStock(!isOpenTradingStock)
  }

  return (
      <div className="w-full">
        <div className="flex justify-between items-center">
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
          <div className="flex gap-6 h-12">
            <Button className="text-gray-700 " onClick={toggleTradingStockOverlay}>BUY/SELL</Button>
          </div>
        </div>
        <div>
          <Overlay isOpen={isOpenTradingStock} onClose={toggleTradingStockOverlay}>
            <TradingStock></TradingStock>
          </Overlay>
        </div>
      </div>
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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

export function SettingsPanel(rowCopyTrading) {
  const { isOpenCopyTradingAccountDelete, setIsOpenCopyTradingAccountDelete } = useContext(CopyTradingAccountContext);
  const { rowCopyTradingAccount, setRowCopyTradingAccount } = useContext(CopyTradingAccountContext);
  

  const orderQuantity = rowCopyTrading.cell.row.original.orderQuantity;
  const filledQuantity = rowCopyTrading.cell.row.original.filledQuantity;

  var  disabledPlaceOrder = true;

  if (filledQuantity < orderQuantity) {
    disabledPlaceOrder = false
  }

  const togglePlaceOrderOverlay = () => {
    if (disabledPlaceOrder == false) {
      if (isOpenCopyTradingAccountDelete == false) {
        setRowCopyTradingAccount(rowCopyTrading)
      }
      setIsOpenCopyTradingAccountDelete(!isOpenCopyTradingAccountDelete);
    } 

    if (isOpenCopyTradingAccountDelete == true) {
      setIsOpenCopyTradingAccountDelete(!isOpenCopyTradingAccountDelete);
    } 
  };

  function changePlaceOrderOpacity(disabled) {
    let classes = "h-6 w-6"
    if (disabled) {
      classes += " opacity-25"
    } else {
      classes += " cursor-pointer"
    }
    return classes
  }

  return (
    <div className="flex">
      <svg onClick={togglePlaceOrderOverlay} xmlns="http://www.w3.org/2000/svg" className={changePlaceOrderOpacity(disabledPlaceOrder)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      <Overlay isOpen={isOpenCopyTradingAccountDelete} onClose={togglePlaceOrderOverlay}>
          <CopyTradingAccountDeleteConfirmation rowCopyTradingAccount={rowCopyTradingAccount}></CopyTradingAccountDeleteConfirmation>
      </Overlay>
    </div>
  );
};




export function ConnectionToggle(row) {
  const {copyTradingAccountData, setCopyTradingAccountData, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful} = useContext(CopyTradingAccountContext);
  var checked_state = false;

  if (row.value == true) {
    checked_state = true
  }

  async function updateAccountConnection(accountName, accountConnection) {
    try {
      await axios.post("/trading_account/connection", {accountName, accountConnection})
      var response = await axios.get("/copy_trading_account/database")
      if (response.data != null) {
        setCopyTradingAccountData(response.data)
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

function CopyTradingTable({ columns, data }) {

  const [accountCreate, setAccountCreate] = useState(false);

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable({
    columns,
    data,
  },
    useFilters, // useFilters!
    useGlobalFilter,
    useSortBy,
    usePagination,  // new
  )

  // Render the UI for your table
  return (
    <>
      <div className="sm:flex sm:gap-x-2">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>
      {/* table */}
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        // Add the sorting props to control sorting. For this example
                        // we can add them into the header props
                        <th
                          scope="col"
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          <div className="flex items-center justify-between">
                            {column.render('Header')}
                            {/* Add a sort direction indicator */}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? <SortDownIcon className="w-4 h-4 text-gray-400" />
                                  : <SortUpIcon className="w-4 h-4 text-gray-400" />
                                : (
                                  <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row, i) => {  // new
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap"
                              role="cell"
                            >
                              {cell.column.Cell.name === "defaultRenderer"
                                ? <div className="text-sm text-gray-500">{cell.render('Cell')}</div>
                                : cell.render('Cell')
                              }
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                value={state.pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <PageButton
                className="rounded-l-md"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">First</span>
                <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                onClick={() => nextPage()}
                disabled={!canNextPage
                }>
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default CopyTradingTable;