import { Link } from 'react-router-dom';
import SocialLink from '@/components/ui/SocialLink';
import { useAuth } from '@/hooks/useAuth';

const Footer = () => {
    const { isAuthenticated } = useAuth();

    return (
        <footer className="md:w-full flex items-center justify-between text-[#f2f2f2] py-4 md:py-6 border-t border-[#f2f2f21a]">
            <div className="w-full flex flex-col md:flex-row-reverse md:justify-between md:items-center">
                <div className="flex md:gap-10 gap-4 flex-wrap">
                    <div className="">
                        <p className="text-xs opacity-50 tracking-wider mb-2">MAIN</p>
                        <div className="flex gap-2">
                            <Link
                                to="/ranking"
                                className="w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                            >
                                Ranking
                            </Link>
                            {isAuthenticated ? (
                                <Link
                                    to="/profile"
                                    className="w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                                >
                                    Profile
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="">
                        <p className="text-xs opacity-50 tracking-wider mb-2">CONTACT</p>
                        <div className="flex gap-2">
                            <SocialLink name="LinkedIn" link="https://www.linkedin.com/in/adrian-anta-gil/" />
                            <SocialLink name="GitHub" link="https://github.com/antaga04" />
                        </div>
                    </div>
                </div>
                <div className="logo flex items-center gap-4">
                    <div>
                        <p className="mt-4 opacity-65 md:opacity-90 md:m-0">
                            Designed and built by{' '}
                            <a
                                href="https://adrian-anta.netlify.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whitespace-nowrap devil-detail"
                            >
                                Adrián Anta.
                            </a>
                        </p>
                        <p className="opacity-65 text-sm hidden md:block">Made with 🌶️ on macOS.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
