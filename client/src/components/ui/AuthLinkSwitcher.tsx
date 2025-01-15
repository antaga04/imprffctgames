import { Link } from 'react-router-dom';

const AuthLinkSwitcher: React.FC<AuthLinkSwitcherTypes> = ({ text, url, anchor }) => {
    return (
        <div className="text-center mt-4">
            <span>{text}</span>
            <Link
                to={url}
                className="text-[#4b6a9d] hover:text-[#35517c] ml-2 transition-colors ease-in-out duration-200"
            >
                {anchor}
            </Link>
        </div>
    );
};

export default AuthLinkSwitcher;
