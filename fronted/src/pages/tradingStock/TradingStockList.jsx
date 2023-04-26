import axios from "axios";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import Select from "react-select";
import { FixedSizeList } from "react-window";


export default function TradingStockList() {
  const [stockNameList, setStockNameList] = useState([])
  const [stockNameListLength, setStockNameListLength] = useState(0);
  //const [inputValue, setInputValue] = useState("");
  
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
  }, [stockNameListLength]);

  //React.useMemo(() => stockNameListLength, [stockNameListLength])

  console.log("wee");

  return (
    <div>
      <header>
        <h1>Stock Pair</h1>
      </header>
      <div style={{ width: "30%", margin: "auto" }}>
        <Select
          onInputChange={val => setInputValue(val)}
          options={stockNameList}
          components={{
            MenuList: TradingStockMenuList,
          }}
        />
      </div>
    </div>
  );
}
