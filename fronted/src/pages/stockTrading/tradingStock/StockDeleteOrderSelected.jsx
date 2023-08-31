import axios from "axios";
import { useState } from 'react';

export default function StockDeleteOrderSelected({rowCopyTradingOrderSelected, selectedOrderDict, onClose}) {
    
    const [isOpenOrderDeleteSelected, setIsOpenOrderDeleteSelected] = useState(false); 
    const [disabledButton, setDisabledButton] = useState(false);
    
    //let stockDescription = rowCopyTradingOrderSelected.cell.row.original.account;
    let accountId = rowCopyTradingOrderSelected.cell.row.original.accountId;
    let accountUsername = rowCopyTradingOrderSelected.cell.row.original.accountUsername;
    let stockOrderId = rowCopyTradingOrderSelected.cell.row.original.stockOrderId;
    let stockDescription = rowCopyTradingOrderSelected.cell.row.original.stockDescription;
    let agentTradingSessionID = rowCopyTradingOrderSelected.cell.row.original.agentTradingSessionID;
    
    async function handleDeleteOrderSelected() {
      // delete order 
      setDisabledButton(true);
      try {

        const allTradingAccountsOrderList = [];

        for (const [key, value] of Object.entries(selectedOrderDict)) {
          // Add the key-value pair as an item to the list
          allTradingAccountsOrderList.push({
              accountId: value["accountId"],
              accountName: value["accountName"],
              accountUsername: value["accountUsername"],
              stockOrderId: value["stockOrderId"]
          })
        }
            
        const response = await axios.delete("/stock_copy_trading/cancel_order/", { data: { agentTradingSessionID: agentTradingSessionID, allTradingAccountsOrderList: allTradingAccountsOrderList }});
        if (response.data == "success") {
          alert("Selected order deleted successful");
          onClose();
        } else {
          alert("Selected order deleted failed")
        }

      } catch(error) {
          alert("Selected order deleted failed")
          console.log(error.message);
      }
      setDisabledButton(false);
    }
      
    return ( 
        <form>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Stock Delete Order (Selected)</h1>
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
                onClick={handleDeleteOrderSelected}
                disabled={disabledButton}
                >
                DELETE ORDER
              </button>
            </div>
        </form>
    )
}