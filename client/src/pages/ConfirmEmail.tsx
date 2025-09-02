/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '@/components/ui/BackButton';
import { verifyEmail } from '@/services/userServices';
import { useTranslation } from 'react-i18next';

const ConfirmEmail = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            toast.promise(verifyEmail(token), {
                loading: `${t('confirm_email.verifying')}...`,
                success: (res) => res || t('confirm_email.success'),
                error: (err) => t(`server.${err.response?.data?.i18n}`) || t('confirm_email.error'),
                finally: () => navigate('/login'),
            });
        } else {
            toast.error(t('confirm_email.no_token'));
        }
    }, [token]);

    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-6">
            <BackButton />

            <div className="text-center mb-6">
                <div className="text-6xl mb-4">📩</div>

                <h1 className="text-4xl font-bold neon-text text-white mb-2">{t('confirm_email.title')}</h1>
                <p className="text-lg text-slate-300 mb-4">{t('confirm_email.description')}</p>
                <p className="text-lg text-slate-300 mb-4">{t('register.check_email')}</p>
                <p className="text-lg text-slate-300 mb-4">{t('confirm_email.note')}</p>
                <Link to="/resend-email">
                    <span className="bg-white hover:bg-white/90 transition-colors duration-150 px-1.5 text-sm font-medium md:px-3.5 rounded-[4px] py-1 text-black">
                        {t('confirm_email.resend')}
                    </span>
                </Link>
            </div>
        </section>
    );
};

export default ConfirmEmail;
