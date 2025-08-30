import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import AuthInput from '@/components/ui/AuthInput';
import ButtonForm from '@/components/ui/ButtonForm';
import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EMAIL_INPUT } from '@/lib/constants';
import { useTranslation } from 'react-i18next';
import { requestPasswordReset } from '@/services/userServices';
import { focusFirstInvalidField, runValidations } from '@/lib/validate';

const RestorePasswordForm = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(true);
    const focusRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        if (!email) {
            toast.error(t('restore_password.email_required'));
            return;
        }

        const { errors, allErrors } = runValidations({ email });
        if (allErrors.length > 0) {
            focusFirstInvalidField(errors);
            toast.error(t('validations.fix_errors'));
            return;
        }

        setDisable(true);

        toast.promise(requestPasswordReset({ email }), {
            loading: t('restore_password.loading'),
            success: (res) => t(`server.${res.data.i18n}`) || t('restore_password.success'),
            error: (err) => t(`server.${err.response.data.i18n}`) || t('restore_password.error'),
            finally: () => setDisable(false),
        });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);

        setDisable(value.trim() === '');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[EMAIL_INPUT].map(({ label, name, type, placeholder }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Mail}
                    value={email}
                    onChange={handleEmailChange}
                    activeValidation={true}
                    focusOnMount={focusRef}
                />
            ))}

            <ButtonForm text={t('restore_password.btn')} disabled={disable} />
        </form>
    );
};

const RestorePassword = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/login" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">{t('restore_password.title')}</h1>
                    <p className="text-sm text-gray-600">{t('restore_password.description')}</p>
                    <RestorePasswordForm />
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

export default RestorePassword;
