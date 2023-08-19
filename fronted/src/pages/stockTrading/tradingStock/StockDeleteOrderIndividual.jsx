import axios from "axios";
import {useContext } from 'react';
import { StockCopyTradingOrderContext } from '../context/StockCopyTradingOrderContext';

export default function StockDeleteOrderIndividual({rowCopyTradingOrderIndividual, onClose}) {
    
  
    const { isOpenOrderDeleteIndividual, setIsOpenOrderDeleteIndividual} = useContext(StockCopyTradingOrderContext);
    
    //let stockDescription = rowCopyTradingOrderIndividual.cell.row.original.account;
    let accountId = rowCopyTradingOrderIndividual.cell.row.original.accountId;
    let accountUsername = rowCopyTradingOrderIndividual.cell.row.original.accountUsername;
    let stockOrderId = rowCopyTradingOrderIndividual.cell.row.original.stockOrderId;
    let stockDescription = rowCopyTradingOrderIndividual.cell.row.original.stockDescription;
    let agentTradingSessionID = rowCopyTradingOrderIndividual.cell.row.original.agentTradingSessionID;
    
    async function handleDeleteOrderIndividual() {
      // delete order 
      try {
  
        const response = await axios.delete("/stock_copy_trading/cancel_order_individual/", { data: { agentTradingSessionID, accountId, accountUsername, stockOrderId }});
        if (response.data == "success") {
          alert("Order deleted successful");
        } else {
          alert("Order deleted failed")
        }
        setIsOpenOrderDeleteIndividual(!isOpenOrderDeleteIndividual); 

      } catch(error) {
          alert("Order deleted failed")
          setIsOpenOrderDeleteIndividual(!isOpenOrderDeleteIndividual); 
          console.log(error.message);
      }
    }
      
    return ( 
        <form>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Delete Order (Individual) - <b>{accountUsername}</b></h1>
            </div>
            <div className="mb-4">Are you sure to delete this order <b>{stockDescription}</b>?</div>
            <div className="flex justify-end gap-5">
              <button
                type="button"
                className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                onClick={onClose}
                >
                CANCEL
              </button>
              <button
                type="button"
                className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                onClick={handleDeleteOrderIndividual}
                >
                DELETE ORDER
              </button>
            </div>
        </form>
    )
}