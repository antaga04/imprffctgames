import BackButton from '@/components/ui/BackButton';
import EmailForm from '@/components/ui/EmailForm';
import SigninLogo from '@/components/ui/SigninLogo';
import { resendEmail } from '@/services/userServices';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ResendEmail = () => {
    const { t } = useTranslation();

    const onSubmit = {
        loading: t('resend_email.loading'),
        success: t('resend_email.success'),
        error: t('resend_email.error'),
        function: resendEmail,
    };

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/login" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">{t('restore_password.title')}</h1>
                    <p className="text-sm text-gray-600">{t('restore_password.description')}</p>
                    <EmailForm onSubmit={onSubmit} />
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-[#4b6a9d] hover:text-[#35517c] hover:underline transition-colors ease-in-out duration-200"
                        >
                            {t('globals.back_login')}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ResendEmail;
