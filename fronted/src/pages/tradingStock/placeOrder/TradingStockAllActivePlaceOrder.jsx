import axios from 'axios';
import { useContext, useState, useEffect, memo } from 'react';
import { OptionPlaceOrderPanelContext } from '../../context/OptionPlaceOrderPanelContext';
import { CopyTradingOrderContext } from '../../context/CopyTradingOrderContext';
import AutocompleteList from './../AutocompleteList';
import { ClipLoader } from 'react-spinners';
import OptionContractList from './OptionContractList';
import OptionContractPlaceOrder from './OptionContractPlaceOrder';
import { OptionContractPlaceOrderContextProvider, useOptionContractPlaceOrderContext } from '../../context/OptionContractPlaceOrderContext';

const TradingStockAllActivePlaceOrder = memo(({ allActivePlaceOrderClose }) => {
    const { isLoading } = useOptionContractPlaceOrderContext();

    return (
        <div>
            {isLoading ? (
                    <ClipLoader loading={true} size={50} />
                ) : (
                    <div className="flex gap-10">
                        <OptionContractList allActivePlaceOrderClose={allActivePlaceOrderClose}></OptionContractList>
                        <OptionContractPlaceOrder allActivePlaceOrderClose={allActivePlaceOrderClose}></OptionContractPlaceOrder>
                    </div>
                )
            }
        </div>
    )
    
});

export default TradingStockAllActivePlaceOrder;