import axios from "axios";


export default function AccountInfo({rowAccount, onClose}) {
    

    const [accountValue, setAccountValue] = useState(null);
    const [cashBalance, setCashBalance] = useState(null)
    const [cashAvailableForTrading, setCashAvailableForTrading] = useState(null)
    const [buyingPower, setBuyingPower] = useState(null)

    const accountUsername = rowAccount.cell.row.original.accountUsername;

    async function account_fetch() {""
      try {
        const response = await axios.post("/trading_account/account_fetch", {accountUsername}); 
        const result = response.data;

        if (result != undefined) {
          setAccountValue(result["securitiesAccount"]["initialBalances"]["accountValue"])
          setCashBalance(result["securitiesAccount"]["initialBalances"]["cashBalance"])
          setCashAvailableForTrading(result["securitiesAccount"]["initialBalances"]["cashAvailableForTrading"])
          setBuyingPower(result["securitiesAccount"]["initialBalances"]["buyingPower"])
        }

      } catch(error) {
          console.log(error.message);
      }
    }

    useEffect(() => {
      account_fetch();
    }, [])

    return (
       
        <form>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Account Info</h1>
            </div>
            <div className="mb-4">
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Account value: <span>{accountValue}</span></h1>
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Cash balance: <span>{cashBalance}</span></h1>
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Cash available for trading: <span>{cashAvailableForTrading}</span></h1>
                <h1 className="block text-gray-700 text-lm font-bold mb-2">Buying power: <span>{buyingPower}</span></h1>
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