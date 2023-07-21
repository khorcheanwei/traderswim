import { Link, useParams } from 'react-router-dom';
import { useContext} from 'react';
import LogoutConfirmation from './pages/common/LogoutConfirmation';
import { UserContext } from './pages/context/UserContext';
import Overlay from "./pages/Overlay"


export default function Header() {
    const { contextAgentUsername, setContextAgentUsername, isLogoutConfirmation, setIsLogoutConfirmation } = useContext(UserContext);

    let { subpage } = useParams();

    if (subpage === undefined) {
        subpage = "account"
    }

    function linkClasses(type = null) {
        let classes = "py-1 px-6";
        if (type === subpage || (subpage === undefined && type === "account")) {
            classes += "  bg-white rounded-full";
        } else {
            classes += "  text-white";
        }
        return classes
    }

    const toggleLogoutConfirmationOverlay = () => {
        setIsLogoutConfirmation(!isLogoutConfirmation);
    };

    return (
        <div>
            <header className="flex justify-between">
                <div className="flex items-center gap-1 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    <span className="font-bold text-xl">traderswim</span>
                </div>
                {!(location.hash == "#/login") && !(location.hash == "#/register") && <nav className="w-full flex justify-center mt-8 gap-2 mb-8">
                    <Link className={linkClasses('account')} to={"/trading/account"}>Account</Link>
                    <Link className={linkClasses('copytrading')} to={"/trading/copytrading"}>Copy Trading</Link>
                    <Link className={linkClasses('tradehistory')} to={"/trading/tradehistory"}>Trade History</Link>
                </nav>}
                <div className="flex items-center gap-3 py-1 px-5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mt-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                    <div>
                        {!!contextAgentUsername && (
                            <div className="primary max-w-sm mt-2">
                                {contextAgentUsername}
                            </div>
                        )}
                    </div>
                    {!(location.hash == "#/login") && !(location.hash == "#/register") &&
                        <button onClick={toggleLogoutConfirmationOverlay} className="bg-white rounded-full p-1 whitespace-nowrap">Log Out</button>}

                </div>
                <Overlay isOpen={isLogoutConfirmation}>
                    <LogoutConfirmation onClose={toggleLogoutConfirmationOverlay}></LogoutConfirmation>
                </Overlay>
            </header>
        </div>
    )
}