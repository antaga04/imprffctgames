import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthInput from '@/components/ui/AuthInput';
import ButtonForm from '@/components/ui/ButtonForm';
import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import { useTranslation } from 'react-i18next';
import { RESET_PASSWORD_INPUTS } from '@/lib/constants';
import { focusFirstInvalidField, runValidations } from '@/lib/validate';
import { resetPassword } from '@/services/userServices';

const ResetPasswordFrom = () => {
    const { t } = useTranslation();
    const [fields, setFields] = useState({ newPassword: '', confirmPassword: '' });

    const [disable, setDisable] = useState(true);
    const focusRef = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
        if (!token) {
            toast.error(t('reset_password.missing_token'));
        }
        // eslint-disable-next-line
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        const { errors, allErrors } = runValidations(fields);
        if (allErrors.length > 0) {
            focusFirstInvalidField(errors);
            toast.error(t('validations.fix_errors'));
            return;
        }

        toast.promise(resetPassword({ token, password: fields.newPassword }), {
            loading: t('reset_password.loading'),
            success: () => {
                setFields({ newPassword: '', confirmPassword: '' });
                navigate('/login');
                return t('reset_password.success');
            },
            error: (err) => {
                return t(`server.${err.response?.data?.i18n}`) || t('reset_password.error');
            },
            finally: () => {
                setDisable(false);
            },
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedFields = { ...fields, [name]: value };

        // Check if all fields are filled
        const allFieldsFilled = Object.values(updatedFields).every((field) => field.trim() !== '');

        setFields(updatedFields);
        setDisable(!allFieldsFilled);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {RESET_PASSWORD_INPUTS.map(({ label, name, type, placeholder, Icon }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Icon}
                    value={fields[name as keyof typeof fields]}
                    onChange={handleInputChange}
                    activeValidation={true}
                    originalPassword={type === 'password' ? fields.newPassword : undefined}
                />
            ))}

            <ButtonForm text={t('reset_password.title')} disabled={disable || !token} />
        </form>
    );
};

const ResetPassword = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/login" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">{t('reset_password.title')}</h1>
                    <p className="text-sm text-gray-600">{t('reset_password.description')}</p>
                    <ResetPasswordFrom />
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

export default ResetPassword;
