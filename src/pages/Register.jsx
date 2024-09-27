import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AtSymbolIcon, KeyIcon, RegisterUserIcon } from '../icons';
import SigninLogo from '../components/SigninLogo';
import BackButton from '../components/BackButton';
import { toast } from 'sonner';

const Register = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !nickname || !password || !confirmPassword) {
      toast.error('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    // Use toast.promise for handling the registration process
    const registerPromise = register(nickname, password, email);

    toast.promise(registerPromise, {
      loading: 'Registering...',
      success: 'Registration successful! Redirecting...',
      error: (error) => error.response?.data?.error || 'An error occurred during registration.',
    });

    try {
      await registerPromise;
    } catch (error) {
      console.error(error);
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

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter an email"
                className="p-2 pl-10 rounded-md border text-sm w-full"
              />
              <AtSymbolIcon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="nickname">Nickname</label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter a nickname"
                className="p-2 pl-10 rounded-md border text-sm w-full"
              />
              <RegisterUserIcon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                className="p-2 pl-10 rounded-md border text-sm w-full"
              />
              <KeyIcon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="p-2 pl-10 rounded-md border text-sm w-full"
              />
              <KeyIcon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
            </div>
          </div>

          <button
            id="register-btn"
            type="submit"
            className="transition-colors duration-200 border outline outline-1 outline-black bg-[#6795df] hover:bg-[#4b6a9d] text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Register
          </button>

          <div className="text-center mt-4">
            <span>Already have an account?</span>
            <Link
              to="/login"
              className="text-[#4b6a9d] hover:text-[#35517c] ml-2 transition-colors ease-in-out duration-200"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
