import { useState, useContext } from 'react';
import TradingStockPlaceOrder from '../tradingStock/TradingStockPlaceOrder';
import { CopyTradingOrderContext } from '../context/CopyTradingOrderContext';
import Overlay from "./../../Overlay"

export function PlaceOrderPanel({row, callOption}) {
    const [isOpenOrderPlace, setIsOpenOrderPlace] = useState(false);
    const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(CopyTradingOrderContext);
  
    const orderPlaceClose = async () => {
      if (isOpenOrderPlace == false) {
        setRowCopyTradingOrder(row)
      }
      setIsOpenOrderPlace(!isOpenOrderPlace)
    }
    let place_order_button_class = "flex "
    let place_order_class = "cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full "
    if (callOption) {
      place_order_class = place_order_class + "bg-green-700"
    } else {
      place_order_button_class = place_order_button_class
      place_order_class = place_order_class + "bg-red-700"
    }
  
    return (
      <div className={place_order_button_class}>
          <div onClick={orderPlaceClose} className={place_order_class}>
          <span className="font-medium text-white dark:text-white">P</span>
        </div>
        <Overlay isOpen={isOpenOrderPlace} >
          <TradingStockPlaceOrder 
            rowCopyTradingOrder={rowCopyTradingOrder} 
            onClose={orderPlaceClose}
            isOpenOrderPlace={isOpenOrderPlace}
            setIsOpenOrderPlace={setIsOpenOrderPlace}
            >
          </TradingStockPlaceOrder>
        </Overlay>
      </div>
    );
  };