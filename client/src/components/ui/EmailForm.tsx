import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import AuthInput from '@/components/ui/AuthInput';
import ButtonForm from '@/components/ui/ButtonForm';
import { Mail } from 'lucide-react';
import { EMAIL_INPUT } from '@/lib/constants';
import { useTranslation } from 'react-i18next';
import { focusFirstInvalidField, runValidations } from '@/lib/validate';
import { AxiosResponse } from 'axios';

type EmailFormProps = {
    loading: string;
    success: string;
    error: string;
    function: (email: string) => Promise<AxiosResponse>;
};

const EmailForm: React.FC<{ onSubmit: EmailFormProps }> = ({ onSubmit }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [disable, setDisable] = useState(true);
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
            toast.error(t('restore_password.email_required'));
            return;
        }

        const { errors, allErrors } = runValidations({ email });
        if (allErrors.length > 0) {
            focusFirstInvalidField(errors);
            toast.error(t('validations.fix_errors'));
            return;
        }

        setDisable(true);

        toast.promise(onSubmit.function(email.trim()), {
            loading: onSubmit.loading,
            success: (res) => t(`server.${res.data.i18n}`) || onSubmit.success,
            error: (err) => t(`server.${err.response.data.i18n}`) || onSubmit.error,
            finally: () => setDisable(false),
        });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setEmail(value);

        setDisable(value.trim() === '');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[EMAIL_INPUT].map(({ label, name, type, placeholder }) => (
                <AuthInput
                    key={name}
                    label={label}
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    Icon={Mail}
                    value={email}
                    onChange={handleEmailChange}
                    activeValidation={true}
                    focusOnMount={focusRef}
                />
            ))}

            <ButtonForm text={t('restore_password.btn')} disabled={disable} />
        </form>
    );
};

export default EmailForm;
