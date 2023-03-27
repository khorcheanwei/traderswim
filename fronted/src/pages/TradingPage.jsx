
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountPage.jsx';
import CopyTradingPage from './copyTrading/CopyTradingPage';
import TradeActivityPage from './tradeActivity/TradeActivityPage';

export default function Trading() {

    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = "account"
    }

    return (
        <div>
            {subpage === 'account' && (
                <AccountsPage></AccountsPage>
            )}
            {subpage === 'copytrading' && (
                <CopyTradingPage></CopyTradingPage>
            )}
            {subpage === 'tradeactivity' && (
               <TradeActivityPage></TradeActivityPage>
            )}
        </div>
    )
}