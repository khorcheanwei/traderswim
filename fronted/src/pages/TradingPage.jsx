
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountsPage.jsx';
import CopyTradingPage from './CopyTradingPage';
import TradeBlotterPage from './TradeBlotterPage';

export default function Trading() {

    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = "accounts"
    }

    return (
        <div>
            {subpage === 'accounts' && (
                <AccountsPage></AccountsPage>
            )}
            {subpage === 'copytrading' && (
                <CopyTradingPage></CopyTradingPage>
            )}
            {subpage === 'tradeblotter' && (
               <TradeBlotterPage></TradeBlotterPage>
            )}
        </div>
    )
}