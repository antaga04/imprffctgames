import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import AuthInput from '@/components/ui/AuthInput';
import ButtonForm from '@/components/ui/ButtonForm';
import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RestorePasswordForm = () => {
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(false);
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
            toast.error('Please enter your email address.');
            return;
        }

        try {
            setDisable(true);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/request-password-reset`, {
                email,
            });

            toast.success(
                response.data?.message ||
                    'If an account with this email exists, you will receive a password reset link shortly.',
            );
        } catch (error) {
            console.error('[RestorePassword] Error:', error);
            const err = error as MyError;
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setDisable(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AuthInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
                Icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                focusOnMount={focusRef}
                activeValidation
            />

            <ButtonForm text="Send reset link" disabled={disable} />
        </form>
    );
};

const RestorePassword = () => {
    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/login" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">Restore Password</h1>
                    <p className="text-sm text-gray-600">
                        Enter your email address and we’ll send you instructions to reset your password.
                    </p>
                    <RestorePasswordForm />
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-[#4b6a9d] hover:text-[#35517c] hover:underline transition-colors ease-in-out duration-200"
                        >
                            Back to login
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RestorePassword;
