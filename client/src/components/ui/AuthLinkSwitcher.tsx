import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AuthLinkSwitcher: React.FC<AuthLinkSwitcherTypes> = ({ url, anchor }) => {
    const { t } = useTranslation();
    return (
        <div className="mt-4 flex gap-2 flex-wrap items-center justify-center">
            <Link
                to={url}
                className="text-[#4b6a9d] hover:text-[#35517c] hover:underline transition-colors ease-in-out duration-200"
            >
                {anchor}
            </Link>
            <span className="hidden md:inline">|</span>
            <Link
                to="/resend-email"
                className="text-[#4b6a9d] hover:text-[#35517c] hover:underline transition-colors ease-in-out duration-200"
            >
                {t('auth.resend_email')}
            </Link>
        </div>
    );
};

export default AuthLinkSwitcher;
