import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import axios from 'axios';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const LOGIN_URL = import.meta.env.VITE_API_URL + '/users/login';
const REGISTER_URL = import.meta.env.VITE_API_URL + '/users/register';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        loading: true,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = () => {
            const token = localStorage.getItem('jwt');
            const storedUser = localStorage.getItem('user');

            if (!token || !storedUser) {
                setAuthState({ isAuthenticated: false, user: null, loading: false });
                return;
            }

            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decodedToken.exp < currentTime) {
                    toast.warning('Your session has expired. Please log in again.');
                    localStorage.removeItem('jwt');
                    localStorage.removeItem('user');
                    setAuthState({ isAuthenticated: false, user: null, loading: false });
                    return;
                }

                const user: AuthUser = JSON.parse(storedUser);
                setAuthState({
                    isAuthenticated: true,
                    user,
                    loading: false,
                });
            } catch (error) {
                console.error('Failed to parse token or user data:', error);
                toast.error('Session data is invalid. Please log in again.');
                localStorage.removeItem('jwt');
                localStorage.removeItem('user');
                setAuthState({ isAuthenticated: false, user: null, loading: false });
            }
        };

        initializeAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(LOGIN_URL, {
                email,
                password,
            });

            const { token, user } = response.data.data;

            localStorage.setItem('jwt', token);
            localStorage.setItem('user', JSON.stringify(user));
            setAuthState({
                isAuthenticated: true,
                user,
                loading: false,
            });
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (nickname: string, email: string, password: string) => {
        try {
            await axios.post(REGISTER_URL, {
                nickname,
                email,
                password,
            });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
        });
    };

    const updateUser = (user: AuthUser) => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
            ...authState,
            user,
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, register, logout, updateUser }}>
            {!authState.loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
