import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import ButtonFrom from '@/components/ui/ButtonForm';
import AuthInput from '@/components/ui/AuthInput';
import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import AuthLinkSwitcher from '@/components/ui/AuthLinkSwitcher';
import { LOGIN_INPUTS } from '@/lib/constants';

const LoginFrom = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState<LoginFromData>({
        email: '',
        password: '',
    });
    const focusRef = useRef<HTMLInputElement>(null);

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
        const { email, password } = formData;

        if (!email || !password) {
            toast.error('All fields are required.');
            return;
        }

        try {
            toast.promise(login(email, password), {
                loading: 'Logging in...',
                success: 'Logged in successfully!',
                error: (err) => err.response?.data?.error || 'Login failed. Please try again.',
            });
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occurred during login.');
        }
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

            <ButtonFrom text="Log in" />
        </form>
    );
};
const Login = () => {
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">Login</h1>
                    <LoginFrom />
                    <AuthLinkSwitcher text="Don't have an account?" url="/register" anchor="Register here" />
                </section>
            </div>
        </div>
    );
};

export default Login;
