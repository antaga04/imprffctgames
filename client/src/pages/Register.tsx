import { useEffect, useRef, useState } from 'react';
import SigninLogo from '@/components/ui/SigninLogo';
import BackButton from '@/components/ui/BackButton';
import ButtonForm from '@/components/ui/ButtonForm';
import AuthLinkSwitcher from '@/components/ui/AuthLinkSwitcher';
import AuthInput from '@/components/ui/AuthInput';
import { useAuth } from '@/hooks/useAuth';
import { REGISTER_INPUTS } from '@/lib/constants';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { register } = useAuth();
    const navigate = useNavigate();
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

        const { email, nickname, password, confirmPassword } = formData;

        if (!email || !nickname || !password || !confirmPassword) {
            toast.error('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            toast.promise(
                register(nickname, email, password).then(() => navigate('/login')),
                {
                    loading: 'Registering...',
                    success: 'Confirmation email has been resent. Please check your inbox.',
                    error: (error) => error.response?.data?.error || 'An error occurred during registration.',
                },
            );
        } catch (error) {
            const errorMessage =
                typeof error === 'string'
                    ? error
                    : error && typeof error === 'object' && 'message' in error
                      ? (error as { message: string }).message
                      : 'An unknown error occurred during registration';

            toast.error(errorMessage);
            console.error('Registration error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} id="register-form" className="flex flex-col gap-4">
            {REGISTER_INPUTS.map(({ label, name, type, placeholder, Icon }, idx) => (
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

            <ButtonForm text="Register" />
        </form>
    );
};

const Register = () => {
    return (
        <div className="w-full flex-1 flex justify-center mt-24 mb-14">
            <BackButton />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">Register</h1>
                    <RegisterForm />
                    <AuthLinkSwitcher text="Already have an account?" url="/login" anchor="Login here" />
                </section>
            </div>
        </div>
    );
};

export default Register;
