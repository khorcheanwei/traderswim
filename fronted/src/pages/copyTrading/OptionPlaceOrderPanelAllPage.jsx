import OptionPlaceOrderPanelPage from '../optionPlaceOrderPanel/OptionPlaceOrderPanelPage';
import OptionPlaceSaveOrderPanelPage from '../optionPlaceOrderPanel/OptionPlaceSaveOrderPanelPage';

export default function OptionPlaceOrderPanelAllPage() {
    return (
        <>
            <div className="w-[50%] flex flex-col">
                <div className="h-[50%] overflow-scroll">
                    <OptionPlaceOrderPanelPage callOption={true}/>
                </div>
                <div className="h-[50%] overflow-scroll">
                    <OptionPlaceSaveOrderPanelPage callOption={true}/>
                </div>
            </div>
            <div className="w-[50%] flex flex-col">
                <div className="h-[50%] overflow-scroll">
                    <OptionPlaceOrderPanelPage callOption={false}/>
                </div>
                <div className="h-[50%] overflow-scroll">
                    <OptionPlaceSaveOrderPanelPage callOption={false}/>
                </div>
            </div>
        </>
    )
}