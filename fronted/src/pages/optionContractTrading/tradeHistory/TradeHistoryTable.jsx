import React from 'react'
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, useSortBy, usePagination } from 'react-table'
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid'
import { Button, PageButton } from '../../shared/Button'
import { classNames } from '../../shared/Utils'
import { SortIcon, SortUpIcon, SortDownIcon } from '../../shared/Icons'
import { useContext, useState, useEffect } from 'react';
import { AccountContext } from '../../context/AccountContext';

import axios from 'axios';
import Overlay from "../../Overlay";
import CommonTable from '../../shared/Table';

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
    <div className="flex">
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
    </div>
  )
}

function TradingActivityTable({ columns, data }) {
  let hiddenColumns = [];
  return CommonTable({ columns, data, GlobalFilter, hiddenColumns })
}

export default TradingActivityTable;