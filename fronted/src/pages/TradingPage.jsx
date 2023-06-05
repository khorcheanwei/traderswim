
import { useParams } from 'react-router-dom';

import AccountsPage from './account/AccountPage.jsx';
import CopyTradingPage from './copyTrading/CopyTradingPage';
import CopyTradingPositionPage from './copyTradingPosition/CopyTradingPositionPage';
import TradeHistoryPage from './tradeHistory/TradeHistoryPage';

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
            {subpage === 'copytradingposition' && (
               <CopyTradingPositionPage></CopyTradingPositionPage>
            )}
            {subpage === 'tradehistory' && (
               <TradeHistoryPage></TradeHistoryPage>
            )}
        </div>
    )
}