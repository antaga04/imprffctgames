/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BackButton from '@/components/ui/BackButton';
import { verifyEmail } from '@/services/requests';

const ConfirmEmail = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            toast.promise(verifyEmail(token), {
                loading: 'Verifying email...',
                success: (res) => res || 'Email verified successfully!',
                error: (err) => err.response?.data?.message || 'Error verifying email.',
                finally: () => navigate('/login'),
            });
        } else {
            toast.error('No token provided.');
        }
    }, [token]);

    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-6">
            <BackButton />

            <div className="text-center mb-6">
                <div className="text-6xl mb-4">📩</div>

                <h1 className="text-4xl font-bold neon-text text-white mb-2">Email Confirmation</h1>
                <p className="text-lg text-slate-300 mb-4">
                    Thank you for registering! This should only take a moment...
                </p>
                <Link to="/resend-email">
                    <span className="bg-white hover:bg-white/90 transition-colors duration-150 px-1.5 text-sm font-medium md:px-3.5 rounded-[4px] py-1 text-black">
                        Resend email
                    </span>
                </Link>
            </div>
        </section>
    );
};

export default ConfirmEmail;
