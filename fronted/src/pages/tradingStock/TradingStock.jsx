
export default function TradingStock() {

    return (
        <div>
            <div>Trade:</div>
            <div>
                <div className="relative w-full lg:max-w-sm">
                    <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option>TSLA</option>
                        <option>APLA</option>
                        <option>ADBE</option>
                    </select>
                </div>
                <div className="relative w-full lg:max-w-sm">
                    <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option>BUY</option>
                        <option>SELL</option>
                    </select>
                </div>
                <div className="relative w-full lg:max-w-sm">
                    <select className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600">
                        <option>Limit</option>
                        <option>Market</option>
                        <option>Stop Market</option>
                        <option>Stop Limit</option>
                        <option>Trailing Stop %</option>
                        <option>Trailing Stop $</option>
                    </select>
                </div>
                <label>Shares: <input type="text" name="name" /></label>
                <label>Price: <input type="text" name="name" /></label>
            </div>
        </div>
    )
}