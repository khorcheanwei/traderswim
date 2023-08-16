import StockOptionPlaceSaveOrderPanelPage from '../optionPlaceOrderPanel/StockOptionPlaceSaveOrderPanelPage';

export default function StockPlaceOrderPanelAllPage() {
    return (
        <div className="flex h-full">
            <div className="overflow-scroll w-full">
                <StockOptionPlaceSaveOrderPanelPage callOption={true}/>
            </div>
            <div className="overflow-scroll w-full">
                <StockOptionPlaceSaveOrderPanelPage callOption={false}/>
            </div>
        </div>
    )
}