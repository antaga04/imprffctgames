import BackButton from '@/components/ui/BackButton';
import axios from 'axios';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ResendEmail = () => {
    const { t } = useTranslation();
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const emailInput = form.elements.namedItem('email') as HTMLInputElement;
        const email = emailInput?.value;

        if (!email) {
            toast.error(t('resend_email.valid_email'));
            return;
        }

        const loadingToastId = toast.loading(t('resend_email.loading'));

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/users/resend-email`, { email });
            toast.success(t('resend_email.success'));
        } catch (error) {
            console.error('Sending email error:', error);
            const err = error as MyError;
            toast.error(err.response?.data?.message || t('resend_email.error'));
        } finally {
            toast.dismiss(loadingToastId);
        }
    };
    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-6">
            <BackButton />
            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="bg-black/50 mt-6 flex h-10 items-center  justify-between gap-2 overflow-hidden rounded-md shadow-border focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0 dark:bg-[#0B0B09] dark:focus-within:ring-white/20 border-gray-200 focus-within:border-gray-400 focus-within:ring-white/20"
            >
                <label htmlFor="email" className="sr-only">
                    {t('constants.email_label')}
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
                    className="text-black mr-1 h-[30px] rounded-[4px] bg-white hover:bg-white/90  transition-colors duration-150 px-1.5 text-sm font-medium md:px-3.5"
                >
                    {t('resend_email.resend')}
                </button>
            </form>
        </section>
    );
};

export default ResendEmail;
