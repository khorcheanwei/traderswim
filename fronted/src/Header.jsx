import { Link, useParams } from 'react-router-dom';
import {useContext} from 'react';
import { UserContext } from './pages/context/UserContext';
import Trading from './pages/TradingPage';

export default function Header() {
    const {user} = useContext(UserContext);

    let {subpage} = useParams();

    if (subpage === undefined) {
        subpage = "accounts"
    }

    function linkClasses(type=null) {
        let classes = "py-2 px-6";
        if (type === subpage || (subpage === undefined && type === "accounts")) {
            classes += "  bg-teal-300 text-white rounded-full";
        }
        return classes
    }

    return (
        <div>
            <header className="flex justify-between">
                <Link to={"/"} className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span className="font-bold text-xl">traderswim</span>
                </Link>
                <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                    <Link className={linkClasses('accounts')} to={"/trading/accounts"}>Accounts</Link>
                    <Link className={linkClasses('copytrading')} to={"/trading/copytrading"}>Copy trading</Link>
                    <Link className={linkClasses('tradeblotter')} to={"/trading/tradeblotter"}>Trade Blotter</Link>
                </nav>
                <Link to={user?'/accounts':'/login'} className="flex items-center gap-2 border-l border-gray-300 rounded-full py-2 px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                    <div className='bg-gray-500 text-white rounded-full p-1 border border-gray-500 overflow-hidden'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative top-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                    </div>  
                    {!!user && (
                        <div>
                            {user.name}
                        </div>
                    )}
                </Link>
            </header>
        </div>
    )
}