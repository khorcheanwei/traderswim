export default function TradingStockWarningMessage({warningMessage, onClose}) {
    return ( 
        <form>
            <div className="mb-4">
                <h1 className="block text-white text-lm font-bold mb-2">{warningMessage}</h1>
            </div>
            <div className="flex justify-end gap-5">
              <button
                type="button"
                className="inline-block rounded bg-white px-7 pt-3 pb-2.5 text-sm font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-teal-300-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-teal-300-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-teal-300-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                onClick={onClose}
                >
                CANCEL
              </button>
            </div>
        </form>
    )
}