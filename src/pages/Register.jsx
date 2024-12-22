import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AtSymbolIcon, KeyIcon, RegisterUserIcon } from '../icons';
import SigninLogo from '../components/ui/SigninLogo';
import BackButton from '../components/ui/BackButton';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import AuthLinkSwitcher from '../components/ui/AuthLinkSwitcher';
import AuthInput from '../components/ui/AuthInput';

const INPUTS = [
  {
    label: 'Nickname',
    name: 'nickname',
    type: 'text',
    placeholder: 'Enter a nickname',
    Icon: RegisterUserIcon,
  },
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter an email',
    Icon: AtSymbolIcon,
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter a password',
    Icon: KeyIcon,
  },
  {
    label: 'Confirm password',
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'Confirm your password',
    Icon: KeyIcon,
  },
];

const Register = () => {
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { register } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
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
      toast.promise(register(nickname, password, email), {
        loading: 'Registering...',
        success: 'Registration successful! Redirecting...',
        error: (error) => error.response?.data?.error || 'An error occurred during registration.',
      });
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="w-full flex-1 flex justify-center mt-24">
      <BackButton />
      <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
        <SigninLogo />
        <form
          onSubmit={handleSubmit}
          id="register-form"
          className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4"
        >
          <h1 className="lusiana-font text-2xl">Register</h1>

          {INPUTS.map(({ label, name, type, placeholder, Icon }) => (
            <AuthInput
              key={name}
              label={label}
              name={name}
              type={type}
              placeholder={placeholder}
              Icon={Icon}
              value={formData[label.toLowerCase().replace(' ', '')]}
              onChange={handleInputChange}
            />
          ))}

          <Button text="Register" />
          <AuthLinkSwitcher text="Already have an account?" url="/login" anchor="Login here" />
        </form>
      </div>
    </div>
  );
};

export default Register;
