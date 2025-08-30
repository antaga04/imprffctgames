import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SingOut: React.FC<SingOutProps> = ({ handleLogout }) => {
    const { t } = useTranslation();
    return (
        <div onClick={handleLogout} className="w-full contents">
            <button className="flex h-[48px] w-fit grow items-center justify-center gap-2 rounded-md bg-red-500 p-3 text-sm font-medium hover:bg-red-600 md:flex-none md:justify-start md:p-2 md:px-3">
                <span className="w-6 h-6 text-white">
                    <LogOut />
                </span>
                <div className="hidden md:block">{t('globals.singout')}</div>
            </button>
        </div>
    );
};

export default SingOut;
