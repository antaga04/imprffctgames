import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const ConfirmEmail = () => {
    const navigate = useNavigate();
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
                    toast.dismiss(loadingToastId);
                    toast.success(message);
                })
                .catch((error) => {
                    console.error('Error verifing email: ', error);
                    toast.dismiss(loadingToastId);
                    toast.error(error.response?.data?.error || 'Something went wrong.');
                });
        } else {
            toast.error('No token provided.');
        }
    }, [token]);

    return (
        <div>
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">📩</div>

                    <h1 className="text-4xl font-bold neon-text text-white mb-2">Email Confirmation</h1>
                    <p className="text-lg text-slate-300">
                        Thank you for registering! This should only take a moment...
                    </p>
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default ConfirmEmail;
