import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AtSymbolIcon, KeyIcon } from '../icons';
import BackButton from '../components/BackButton';
import SigninLogo from '../components/SigninLogo';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      console.error(error);
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
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="p-2 pl-10 rounded-md border text-sm w-full"
              />
              <AtSymbolIcon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="relative flex flex-col gap-1">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="p-2 pl-10 rounded-md border text-sm w-full"
              />
              <KeyIcon className="absolute left-2 top-2 h-6 w-6 text-gray-500" />
            </div>
          </div>
          <button
            id="login-btn"
            type="submit"
            className="transition-colors duration-200 border outline outline-1 outline-black bg-[#6795df] hover:bg-[#4b6a9d] text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Log in
          </button>
          <div className="text-center mt-4">
            <span>{`Don't have an account?`}</span>
            <Link
              to="/register"
              className="text-[#4b6a9d] hover:text-[#35517c] ml-2 transition-colors ease-in-out duration-200"
            >
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
