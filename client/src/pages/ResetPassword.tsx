import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthInput from '@/components/ui/AuthInput';
import ButtonForm from '@/components/ui/ButtonForm';
import BackButton from '@/components/ui/BackButton';
import SigninLogo from '@/components/ui/SigninLogo';
import { Lock } from 'lucide-react';
import axios from 'axios';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [disable, setDisable] = useState(false);
    const focusRef = useRef<HTMLInputElement>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    useEffect(() => {
        if (focusRef.current) {
            focusRef.current.focus();
        }
        if (!token) {
            toast.error('Missing or invalid token.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        if (!newPassword || !confirmPassword) {
            toast.error('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        try {
            setDisable(true);

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
                token,
                password: newPassword,
            });

            toast.success(response.data?.message || 'Password reset successful!');
            navigate('/login');
        } catch (error) {
            console.error('[ResetPassword] Error:', error);
            const err = error as MyError;
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setDisable(false);
        }
    };

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <BackButton url="/login" />
            <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
                <SigninLogo />
                <section className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4">
                    <h1 className="lusiana-font text-2xl">Reset Password</h1>
                    <p className="text-sm text-gray-600">Enter your new password below.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <AuthInput
                            label="New Password"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            Icon={Lock}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            focusOnMount={focusRef}
                            activeValidation
                        />
                        <AuthInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            Icon={Lock}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            activeValidation
                        />
                        <ButtonForm text="Reset Password" disabled={disable || !token} />
                    </form>
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

export default ResetPassword;
