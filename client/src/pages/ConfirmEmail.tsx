import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import BackButton from '@/components/ui/BackButton';

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

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const emailInput = form.elements.namedItem('email') as HTMLInputElement;
        const email = emailInput?.value;

        if (!email) {
            toast.error('Please provide a valid email address.');
            return;
        }

        const loadingToastId = toast.loading('Verifying email...');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/users/resend-email`, { email });
            toast.success('Email sent successfully.');
        } catch (error) {
            console.error('Error sending email: ', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.error || 'Error sending email';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            toast.dismiss(loadingToastId);
        }
    };

    return (
        <div className="flex flex-col items-center justify-between min-h-screen p-6">
            <BackButton />
            <section className="flex flex-col items-center justify-center flex-1">
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">📩</div>

                    <h1 className="text-4xl font-bold neon-text text-white mb-2">Email Confirmation</h1>
                    <p className="text-lg text-slate-300">
                        Thank you for registering! This should only take a moment...
                    </p>
                </div>

                <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Login
                </button>
            </section>
            <section>
                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="bg-black/50 mt-6 flex h-10 items-center  justify-between gap-2 overflow-hidden rounded-md shadow-border focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0 dark:bg-[#0B0B09] dark:focus-within:ring-white/20 border-gray-200 focus-within:border-gray-400 focus-within:ring-white/20"
                >
                    <label htmlFor="email" className="sr-only">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        className="text-white h-full w-[40%] grow border-none bg-transparent px-3.5 transition-colors placeholder:text-gray-300 focus:outline-none"
                        required
                        placeholder="Enter your email"
                    />
                    <button
                        type="submit"
                        className="mr-1 h-[30px] rounded-[4px] bg-[var(--blueish)] hover:bg-[#3d68ad] transition-colors duration-150 px-1.5 text-sm font-medium md:px-3.5"
                    >
                        Resend email
                    </button>
                </form>
            </section>
        </div>
    );
};

export default ConfirmEmail;
