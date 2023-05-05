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
        console.error(error);
    }
  }

  useEffect(() => {
    getStockNameList();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Pair:</h1>
        <Select
          className="shadow appearance-none border rounded w-full text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          onChange={val => setStockNameID(val.value)}
          options={stockNameList}
          components={{
            MenuList: TradingStockMenuList,
          }}
        />
      </div>
    </div>
  );
}


