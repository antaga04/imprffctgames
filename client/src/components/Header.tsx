import { NavLink } from 'react-router-dom';
import SingOut from '@/components/ui/SingOut';
import { useAuth } from '@/context/AuthContext';
import { Medal, User } from 'lucide-react';

const Header = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <header className="w-full flex flex-col items-center justify-between text-white text-center z-50 md:flex-row pt-4">
            <div className="flex justify-start items-center">
                <div
                    id="logo"
                    className="logo flex items-center gap-2 bg-slate-500 md:bg-transparent w-full rounded-lg px-4 mb-2 md:w-fit md:mb-0"
                >
                    <div className=" flex flex-col p-2 tems-start justify-start">
                        <h1 className="text-3xl">PuzLynk</h1>
                        <a
                            href="https://adrian-anta.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex opacity-60 hover:opacity-75 transition-opacity ease-in-out duration-250"
                        >
                            by Adrián Anta
                        </a>
                    </div>
                </div>
            </div>
            <nav className="flex gap-1 md:gap-2 w-full md:justify-end">
                <NavLink
                    to="/ranking"
                    className="w-full md:w-fit px-2 py-1 md:px-4 md:py-2 fill-white flex gap-2 items-center rounded-lg bg-[#f2f2f20f] hover:bg-[#f2f2f233] border border-[#f2f2f20a] hover:border-[#f2f2f21a] backdrop-blur-md transition-all duration-400 ease-custom-ease-1 text-lg"
                >
                    <Medal />
                    <span className="">Ranking</span>
                </NavLink>
                {isAuthenticated ? (
                    <>
                        <NavLink
                            to="/profile"
                            className="w-full md:w-fit px-4 py-2 fill-white flex gap-2 items-center rounded-lg bg-[#f2f2f20f] hover:bg-[#f2f2f233] border border-[#f2f2f20a] hover:border-[#f2f2f21a] backdrop-blur-md transition-all duration-400 ease-custom-ease-1 text-lg"
                        >
                            <User />
                            <span className="">Profile</span>
                        </NavLink>
                        <SingOut handleLogout={logout} />
                    </>
                ) : (
                    <NavLink
                        to="/login"
                        className="w-full md:w-fit px-4 py-2 fill-white flex gap-2 items-center rounded-lg bg-[#f2f2f20f] hover:bg-[#f2f2f233] border border-[#f2f2f20a] hover:border-[#f2f2f21a] backdrop-blur-md transition-all duration-400 ease-custom-ease-1 text-lg"
                    >
                        <User />
                        <span className="">Login</span>
                    </NavLink>
                )}
            </nav>
        </header>
    );
};

export default Header;
