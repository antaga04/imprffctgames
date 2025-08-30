import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ButtonFrom from '@/components/ui/ButtonForm';
import AuthInput from '@/components/ui/AuthInput';
import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import AuthLinkSwitcher from '@/components/ui/AuthLinkSwitcher';
import { LOGIN_INPUTS } from '@/lib/constants';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LoginFrom = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginFromData>({
        email: '',
        password: '',
    });
    const focusRef = useRef<HTMLInputElement>(null);
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        const { email, password } = formData;
        if (!email || !password) {
            toast.error(t('globals.all_fields_required'));
            return;
        }

        toast.promise(login(email, password), {
            loading: t('login.loading'),
            success: t('login.success'),
            error: (err) => t(`server.${t(`server.${err.response?.data?.i18n}`)}`) || t('login.error'),
        });
    };

    return (
        <form onSubmit={handleSubmit} id="login-form" className="flex flex-col gap-4">
            {LOGIN_INPUTS.map(({ label, name, type, placeholder, Icon }, idx) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Icon}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleInputChange}
                    focusOnMount={idx === 0 ? focusRef : undefined}
                />
            ))}

            <div className="">
                <Link
                    to="/restore-password"
                    className="text-[#4b6a9d] hover:text-[#35517c] hover:underline transition-colors ease-in-out duration-200"
                >
                    {t('login.forgot_password')}
                </Link>
            </div>

            <ButtonFrom text={t('login.title')} disabled={disable} />
        </form>
    );
};
const Login = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">{t('login.title')}</h1>
                    <LoginFrom />
                    <AuthLinkSwitcher text={t('login.register')} url="/register" anchor={t('login.no_account')} />
                </section>
            </div>
        </div>
    );
};

export default Login;
