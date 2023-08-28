import { useState, useContext } from 'react';
import StockPlaceOrder from '../tradingStock/StockPlaceOrder';
import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';
import Overlay from "../../Overlay"

export function StockPlaceOrderPanel({row}) {
    const [isOpenOrderPlace, setIsOpenOrderPlace] = useState(false);
    const { rowCopyTradingOrder, setRowCopyTradingOrder } = useContext(StockCopyTradingOrderContext);
  
    const orderPlaceClose = async () => {
      if (isOpenOrderPlace == false) {
        setRowCopyTradingOrder(row)
      }
      setIsOpenOrderPlace(!isOpenOrderPlace)
    }
    let place_order_class = "cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full "
    place_order_class = place_order_class + "bg-purple-600"
   
    return (
      <div className="flex">
          <div onClick={orderPlaceClose} className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-600">
          <span className="font-medium text-white dark:text-white">P</span>
        </div>
        <div></div>
        <Overlay isOpen={isOpenOrderPlace} >
          <StockPlaceOrder 
            rowCopyTradingOrder={rowCopyTradingOrder} 
            onClose={orderPlaceClose}
            isOpenOrderPlace={isOpenOrderPlace}
            setIsOpenOrderPlace={setIsOpenOrderPlace}
            >
          </StockPlaceOrder>
        </Overlay>
      </div>
    );
  };