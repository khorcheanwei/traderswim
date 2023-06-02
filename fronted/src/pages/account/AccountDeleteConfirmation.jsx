import axios from "axios";
import {useContext } from 'react';
import { AccountContext } from '../context/AccountContext';

export default function AccountDeleteConfirmation({rowAccount, onClose}) {
    
    const { accountTableData, setAccountTableData} = useContext(AccountContext);
    const { isOpenAccountDelete, setIsOpenAccountDelete} = useContext(AccountContext);

    const accountName = rowAccount.cell.row.original.accountName;

    async function deleteAccountDelete() {
      // delete account based on accountName
      try {
        await axios.post("/trading_account/delete_account", {accountName});
        alert("Account deleted successful")
        var response = await axios.get("/trading_account/database")
        
        if (response.data != null) {
          setAccountTableData(response.data)
        }

        setIsOpenAccountDelete(!isOpenAccountDelete);

      } catch(error) {
          alert("Account deleted failed")
          console.log(error.message);
      }
    }
    return (
       
        <form>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Delete Account</h1>
            </div>
            <div className="mb-4">Are you sure to delete this account <b>{accountName}</b> ?</div>
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
                onClick={deleteAccountDelete}
                >
                DELETE
              </button>
            </div>
        </form>
    )
}