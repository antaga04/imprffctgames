import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import BackButton from '@/components/ui/BackButton';

const ConfirmEmail = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    useEffect(() => {
        if (token) {
            const loadingToastId = toast.loading('Verifing email...');
            axios
                .post(`${import.meta.env.VITE_API_URL}/users/confirm-email`, { token })
                .then((response) => {
                    const message = response.data?.message || 'Email confirmed!';
                    console.log(message);
                    toast.success(message);
                })
                .catch((error) => {
                    console.error('Error verifing email: ', error);
                    toast.error(error.response?.data?.error || 'Something went wrong.');
                })
                .finally(() => {
                    toast.dismiss(loadingToastId);
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
