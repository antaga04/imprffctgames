import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AtSymbolIcon, KeyIcon } from '../icons';
import BackButton from '../components/ui/BackButton';
import SigninLogo from '../components/ui/SigninLogo';
import { toast } from 'sonner';
import Button from '../components/ui/Button';
import AuthLinkSwitcher from '../components/ui/AuthLinkSwitcher';
import AuthInput from '../components/ui/AuthInput';

const INPUTS = [
  {
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'Enter your email',
    Icon: AtSymbolIcon,
  },
  {
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Enter your password',
    Icon: KeyIcon,
  },
];

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      toast.error('All fields are required.');
      return;
    }

    try {
      toast.promise(login(email, password), {
        loading: 'Logging in...',
        success: 'Logged in successfully!',
        error: (err) => err.response?.data?.error || 'Login failed. Please try again.',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login.');
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center">
      <BackButton url="/" />
      <div className="flex flex-col w-full md:p-4 mx-auto md:-mt-3 max-w-[425px] md:max-w-[500px]">
        <SigninLogo />
        <form
          onSubmit={handleSubmit}
          id="login-form"
          className="mt-5 flex flex-col gap-4 bg-[#f9fafb] text-[#111827] rounded-md px-8 py-4"
        >
          <h1 className="lusiana-font text-2xl">Login</h1>

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

          <Button text="Log in" />
          <AuthLinkSwitcher text="Don't have an account?" url="/register" anchor="Register here" />
        </form>
      </div>
    </div>
  );
};

export default Login;
