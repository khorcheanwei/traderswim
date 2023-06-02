import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import Select from "react-select";
import { FixedSizeList } from "react-window";
import { TradeStockContext } from './../context/TradeStockContext';


export default function TradingStockList() {
  const { stockNameID, setStockNameID } = useContext(TradeStockContext);

  const [stockNameList, setStockNameList] = useState([])
  const [stockNameListLength, setStockNameListLength] = useState(0);
  
  const TradingStockMenuList = props => {
    const itemHeight = 35;
    const { options, children, maxHeight, getValue } = props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * itemHeight;
  
    return (
      <div>
        <FixedSizeList 
          height={maxHeight}
          itemCount={children.length}
          itemSize={itemHeight}
          initialScrollOffset={initialOffset}
        >
          {({ index, style }) => <div style={style}>{children[index]}</div>}
        </FixedSizeList>
      </div>
    );
  };
  
  async function getStockNameList() {
       try {
        const response = await axios.get("/copy_trading_account/get_stock_pair_list")
        setStockNameListLength(response.data.length)
        setStockNameList(response.data)
      } catch (error) {
        console.log(error.message);
    }
  }

  useEffect(() => {
    getStockNameList();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4">
        <input
            className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            type="text"
            onChange={event => setStockNameID(event.target.value)}
            value={stockNameID}
            placeholder=" " />
        <label
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
            htmlFor="small_outlined">
            Stock Pair:
        </label>
      </div>
    </div>
  );
}


