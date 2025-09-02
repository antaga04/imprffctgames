import BackButton from '@/components/ui/BackButton';
import { deleteAccount as axiosDelete } from '@/services/userServices';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DeleteAccount = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const navigate = useNavigate();

    async function deleteAccount() {
        if (!token) return;
        toast.promise(axiosDelete(token), {
            loading: `${t('confirm_email.verifying')}...`,
            success: (res) => res.data.i18n || t('confirm_email.success'),
            error: (err) => t(`server.${err.response?.data?.i18n}`) || t('confirm_email.error'),
            finally: () => navigate('/login'),
        });
    }

    useEffect(() => {
        if (token) {
            deleteAccount();
        } else {
            toast.error(t('confirm_email.no_token'));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const handleDeleteAccount = () => {
        toast(t('delete_account.warning'), {
            action: (
                <button
                    onClick={() => deleteAccount()}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white m-auto p-2 h-6 flex items-center rounded-sm transition-colors duration-200"
                >
                    {t('delete_account.title')}
                </button>
            ),
            duration: Infinity,
        });
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-6">
            <BackButton />

            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold neon-text text-white mb-6">{t('delete_account.title')}</h1>
                <p className="text-lg text-slate-300 mb-4">{t('delete_account.description')}</p>
                {!token && (
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            {t('globals.cancel')}
                        </button>
                        <button
                            onClick={handleDeleteAccount}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                            {t('delete_account.title')}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DeleteAccount;
