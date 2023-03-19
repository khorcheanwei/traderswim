import axios from "axios";
import { Link , Navigate} from 'react-router-dom';
import {useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';

export default function CopyTradingAdd() {

    const { accountNameListData, setAccountNameListData } = useContext(AccountContext);
    const [isOpenTradeRisk, setIsOpenTradeRisk] = useState(false);

    const findAccountCopierList = (accountNameListData, masterAccount) => {
        var newAccountCopierArray = []
        accountNameListData.map(account => {
            if (account.accountName != masterAccount) {
                newAccountCopierArray.push(account)
            }
        });
        return newAccountCopierArray
    };

    var [masterAccount, setMasterAccount] = useState(accountNameListData[0].accountName);
    var [accountCopierArray, setAccountCopierArray] = useState(findAccountCopierList(accountNameListData, masterAccount));
   
    async function handleTradingAccountList(event) {
        const masterAccount = event.target.value
        try{
            setAccountCopierArray(findAccountCopierList(accountNameListData, masterAccount));
            
        } catch (e) {
            console.log(e)
            return []
        }   
    }

    function handleTradeRiskType(event) {
        const tradeRiskType = event.target.value;
        if (tradeRiskType == "Fixed lot") {
            console.log(tradeRiskType)
            setIsOpenTradeRisk(false)
        } else {
            setIsOpenTradeRisk(true)
        }
    }


    return (
        <form>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Master account</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleTradingAccountList}>
                    {accountNameListData.map((account, index) => (
                        <option key={index} >{account.accountName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Account copier</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
                    {accountCopierArray.map((account, index) => (
                        <option key={index} >{account.accountName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Trade risk type</label>
                <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleTradeRiskType}>
                    <option>Fixed lot</option>
                    <option>Lot multiplier</option>
                </select>
            </div>
  
            {isOpenTradeRisk ?  (
                <div className="mb-6">  
                    <label className="block text-gray-700 text-sm font-bold mb-2" >Trade risk %</label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        type="text" 
                        placeholder="">
                    </input>
                </div>
                ) : null}

            <div className="flex items-center justify-between">
                <div className="text-center lg:text-left">
                    <button
                    type="button"
                    className="inline-block rounded bg-teal-300 px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                    >
                    Confirm
                    </button>
                </div>
            </div>
        </form>
    )
}