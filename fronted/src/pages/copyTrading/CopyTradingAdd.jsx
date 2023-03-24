import axios from "axios";
import { Link , Navigate} from 'react-router-dom';
import {useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { AccountContext } from '../context/AccountContext';
import { CopyTradingAccountContext } from '../context/CopyTradingAccountContext';

export default function CopyTradingAdd() {

    const { contextAgentID} = useContext(UserContext);
    const { masterAccountList, setMasterAccountList, copierAccountList, setCopierAccountList} = useContext(CopyTradingAccountContext);
    const {isOpenCopyTradingAccount, setIsOpenCopyTradingAccount, isCopyTradingAccountSuccessful, setIsCopyTradingAccountSuccessful} = useContext(CopyTradingAccountContext);

    const [isOpenTradeRisk, setIsOpenTradeRisk] = useState(false);
    
    const [masterAccountName, setMasterAccountName] = useState(masterAccountList[0].accountName);

    const [copierAccountNameList, setCopierAccountNameList] = useState(findCopierAccountNameList(copierAccountList, masterAccountName));
    const [copierAccountName, setCopierAccountName] = useState(copierAccountNameList[0].accountName);

    const [tradeRiskType, setTradeRiskType] = useState("Fixed Lot");
    const [tradeRiskPercent, setTradeRiskPercent] = useState(100);


    function findCopierAccountNameList(copierAccountList, masterAccountName) {
        // ensure selected masterAccountName is not in copierAccountNameList
        try{
            var newcopierAccountNameList = []
            copierAccountList.map(account => {
                if (account.accountName != masterAccountName) {
                    newcopierAccountNameList.push(account)
                }
            });
        return newcopierAccountNameList
        } catch(e) {
            console.log(e)
            return []
        }
        
    };
    
    function handleCreateCopierAccountNameList(event) {
        // create new newcopierAccountNameList excluding masterAccountName
        try{
            const eventMasterAccountName = event.target.value
            const newcopierAccountNameList = findCopierAccountNameList(copierAccountList, eventMasterAccountName)
            
            setMasterAccountName(eventMasterAccountName)
            setCopierAccountName(newcopierAccountNameList[0].accountName)

            setCopierAccountNameList(newcopierAccountNameList);
        } catch (e) {
            console.log(e)
            return []
        }   
    }

    function handleSetCopierAccountName(event) {
        // set current selected copierAccountName
        const eventCopierAccountName = event.target.value
        setCopierAccountName(eventCopierAccountName)
    }

    function handleTradeRiskType(event) {
        // set tradeRiskType - Set trading risk type - Fixed Lot, Lot Multiplier

        const eventTradeRiskType = event.target.value;
        setTradeRiskType(eventTradeRiskType)

        if (eventTradeRiskType == "Fixed Lot") {
            setTradeRiskPercent(100)
            setIsOpenTradeRisk(false)
        } else {
            setIsOpenTradeRisk(true)
        }
    }

    function handleTradeRiskPercent(event) {
         // set tradeRiskPercent - Set trading risk of percentage leverage 

        const eventTradeRiskPercent = event.target.value;
        setTradeRiskPercent(eventTradeRiskPercent)
    }

    
    async function handleCopyTradingAccountAdd(event) {
        // Add copier trading account to database
        try {
            const agentID = contextAgentID
            var masterAccountID = ""
            var copierAccountID = ""


            for (var i=0; i < masterAccountList.length; i++) {
                if (masterAccountList[i].accountName == masterAccountName) {
                    masterAccountID = masterAccountList[i]._id;
                    break
                }
            }

            for (var i=0; i < copierAccountList.length; i++) {
                if (copierAccountList[i].accountName == copierAccountName) {
                    copierAccountID = copierAccountList[i]._id;
                    break
                }
            }

            console.log(copierAccountName);
        
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
                    onChange={handleCreateCopierAccountNameList}
                    value={masterAccountName}>
                    {masterAccountList.map((account, index) => (
                        <option key={index} >{account.accountName}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Account copier</label>
                <select 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    onChange={handleSetCopierAccountName}
                    value={copierAccountName}>
                    {copierAccountNameList.map((account, index) => (
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