import axios from "axios";
import { Link , Navigate} from 'react-router-dom';
import {useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';

export default function CopyTradingAdd() {

    const { contextAgentID} = useContext(UserContext);
    const { accountNameList, setAccountNameList} = useContext(AccountContext);
    const {isOpenCopyTradingAccount, setIsOpenCopyTradingAccount, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful} = useContext(CopyTradingAccountContext);

    const [isOpenTradeRisk, setIsOpenTradeRisk] = useState(false);
    
    const [masterAccountName, setMasterAccountName] = useState(accountNameList[0].accountName);
    const [copierAccountName, setCopierAccountName] = useState(accountNameList[1].accountName);
    const [tradeRiskType, setTradeRiskType] = useState("Fixed Lot");
    const [tradeRiskPercent, setTradeRiskPercent] = useState(100);

    const [copierAccountNameArray, setCopierAccountNameArray] = useState(findCopierAccountNameList(accountNameList, masterAccountName));

    function findCopierAccountNameList(accountNameList, masterAccountName) {
        var newcopierAccountNameArray = []
        accountNameList.map(account => {
            if (account.accountName != masterAccountName) {
                newcopierAccountNameArray.push(account)
            }
        });
        return newcopierAccountNameArray
    };
    
    function handleCopierAccountNameList(event) {
        event.preventDefault()

        const eventMasterAccountName = event.target.value
        const newcopierAccountNameArray = findCopierAccountNameList(accountNameList, eventMasterAccountName)
        
        setMasterAccountName(eventMasterAccountName)
        setCopierAccountName(newcopierAccountNameArray[0].accountName)

        try{
            setCopierAccountNameArray(newcopierAccountNameArray);
        } catch (e) {
            console.log(e)
            return []
        }   
    }

    function handleCopierAccountName(event) {
        event.preventDefault()

        const eventCopierAccountName = event.target.value
        setCopierAccountName(eventCopierAccountName)
    }

    function handleTradeRiskType(event) {
        event.preventDefault()

        const eventTradeRiskType = event.target.value;
        setTradeRiskType(eventTradeRiskType)

        if (eventTradeRiskType == "Fixed lot") {
            setTradeRiskPercent(100)
            setIsOpenTradeRisk(false)
        } else {
            setIsOpenTradeRisk(true)
        }
    }

    function handleTradeRiskPercent(event) {
        event.preventDefault()
        const eventTradeRiskPercent = event.target.value;

        setTradeRiskPercent(eventTradeRiskPercent)
    }

    
    async function handleCopyTradingAccountAdd(event) {
        event.preventDefault()

        try {
            const agentID = contextAgentID
            var masterAccountID = ""
            var copierAccountID = ""


            for (var i=0; i < accountNameList.length; i++) {
                if (accountNameList[i].accountName == masterAccountName) {
                    masterAccountID = accountNameList[i]._id
                }
                if (accountNameList[i].accountName == copierAccountName) {
                    copierAccountID = accountNameList[i]._id
                }
            }
        
            const {data} = await axios.post("/copy_trading_account/add_copier_account/", {agentID, masterAccountID, copierAccountID, tradeRiskType, tradeRiskPercent});
    
            if (data.id != "undefined") {
                alert("Copier account added successfully.");
                setIsOpenCopyTradingAccount(!isOpenCopyTradingAccount)
                setIsCopyTradingAccountSuccessful(true)
            } else {
                alert("Copier account is failed to add")
            }
        } catch (e) {
            console.log(e)
            alert("Login failed.");
        }   

    }


    return (
        <form>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Master account</label>
                <select 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleCopierAccountNameList}
                    value={masterAccountName}>
                    {accountNameList.map((account, index) => (
                        <option key={index} >{account.accountName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Account copier</label>
                <select 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleCopierAccountName}
                    value={copierAccountName}>
                    {copierAccountNameArray.map((account, index) => (
                        <option key={index} >{account.accountName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Trade risk type</label>
                <select 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleTradeRiskType}
                    value={tradeRiskType}>
                    <option>Fixed lot</option>
                    <option>Lot Multiplier</option>
                </select>
            </div>
  
            {isOpenTradeRisk ?  (
                <div className="mb-6">  
                    <label className="block text-gray-700 text-sm font-bold mb-2" >Trade risk %</label>
                    <input 
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
                        onChange={handleTradeRiskPercent}
                        value={tradeRiskPercent}
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
                    onClick={handleCopyTradingAccountAdd}
                    >
                    Confirm
                    </button>
                </div>
            </div>
        </form>
    )
}