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
import { focusFirstInvalidField, runValidations } from '@/lib/validate';

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
    const [disable, setDisable] = useState(false);

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

        if (disable) return;

        setDisable(true);
        setTimeout(() => setDisable(false), 2000);

        const { email, nickname, password } = formData;

        const { errors, allErrors } = runValidations(formData);
        if (allErrors.length > 0) {
            focusFirstInvalidField(errors);
            toast.error('Please fix validation errors.');
            return;
        }

        toast.promise(
            register(nickname.trim(), email.trim(), password.trim()).then(() => navigate('/login')),
            {
                loading: 'Registering...',
                success: 'Confirmation email has been resent. Please check your inbox.',
                error: (error) => error.response?.data?.message || 'An error occurred during registration.',
            },
        );
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
                    originalPassword={type === 'password' ? formData.password : undefined}
                    activeValidation={true}
                />
            ))}

            <ButtonForm text="Register" disabled={disable} />
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
