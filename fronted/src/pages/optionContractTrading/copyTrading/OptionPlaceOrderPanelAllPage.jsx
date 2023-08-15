import OptionPlaceOrderPanelPage from '../optionPlaceOrderPanel/OptionPlaceOrderPanelPage';
import OptionPlaceSaveOrderPanelPage from '../optionPlaceOrderPanel/OptionPlaceSaveOrderPanelPage';

export default function OptionPlaceOrderPanelAllPage() {
    return (
        <div className="flex h-full">
            <div className="overflow-scroll w-full">
                <OptionPlaceSaveOrderPanelPage callOption={true}/>
            </div>
            <div className="overflow-scroll w-full">
                <OptionPlaceSaveOrderPanelPage callOption={false}/>
            </div>
        </div>
    )
}