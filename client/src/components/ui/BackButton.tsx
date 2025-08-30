import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BackButton: React.FC<{ url?: string }> = ({ url }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const automaticNavigate = () => {
        if (location.key !== 'default') {
            navigate(-1);
        } else {
            navigate('/');
        }
    };
    const handleBack = () => {
        return url ? navigate(url) : automaticNavigate();
    };

    return (
        <button
            onClick={handleBack}
            className="group absolute top-4 left-4 md:top-10 md:left-10 flex items-center px-4 py-2 rounded-3xl text-[#f2f2f2] bg-[#f2f2f226] hover:bg-[#f2f2f233] border border-[#f2f2f20a] hover:border-[#f2f2f21a] z-10 backdrop-blur-md transition-all duration-400 ease-custom-ease-1"
        >
            <span className="inline-block mr-2 transform transition-transform duration-300 ease-custom-ease-2 group-hover:-translate-x-1 fill-[#f2f2f2]">
                <ChevronLeft className="h-5 w-5" />
            </span>
            {t('globals.back')}
        </button>
    );
};

export default BackButton;
