import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useTempScore } from '@/hooks/useTempScore';
import { handleScoreUpload } from '@/lib/scoreHandler';
import { useTranslation } from 'react-i18next';

const LOGIN_URL = import.meta.env.VITE_API_URL + '/users/login';
const REGISTER_URL = import.meta.env.VITE_API_URL + '/users/register';
const LOGOUT_URL = import.meta.env.VITE_API_URL + '/users/logout';
const VERIFY_URL = import.meta.env.VITE_API_URL + '/users/verify';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t } = useTranslation();
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        loading: true,
    });
    const { tempScore, clearTempScore } = useTempScore(); // Access tempScore and clearing method
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const hasSession = localStorage.getItem('hasSession'); // Check if the user ever had a session

            if (!hasSession) {
                setAuthState({
                    isAuthenticated: false,
                    loading: false,
                });
            } else {
                try {
                    await axios.get(VERIFY_URL, { withCredentials: true });
                    localStorage.setItem('hasSession', 'true');
                    setAuthState({
                        isAuthenticated: true,
                        loading: false,
                    });
                } catch (error) {
                    const err = error as MyError;

                    if (err?.response?.status === 401) {
                        toast.warning(t('auth.session_expired'));
                        localStorage.removeItem('hasSession');
                        sessionStorage.setItem('hasShownRegisterToast', 'true');
                    } else {
                        console.error('An unexpected error occurred:', error);
                        toast.error(err.response?.data?.message || t('auth.general_error'));
                    }

                    setAuthState({
                        isAuthenticated: false,
                        loading: false,
                    });
                }
            }
        };

        initializeAuth();

        // Handle visibility change to check token validity in the background
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                await initializeAuth();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
        // eslint-disable-next-line
    }, []);

    const login = async (email: string, password: string) => {
        try {
            await axios.post(LOGIN_URL, { email, password }, { withCredentials: true });
            setAuthState({
                isAuthenticated: true,
                loading: false,
            });
            localStorage.setItem('hasSession', 'true');
            navigate('/');

            if (tempScore) {
                const { scoreData, gameId, slug } = tempScore;

                await handleScoreUpload({
                    scoreData,
                    gameId,
                    slug,
                });

                clearTempScore();
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axios.post(LOGOUT_URL, {}, { withCredentials: true });
            setAuthState({
                isAuthenticated: false,
                loading: false,
            });
            clearTempScore();
            navigate('/login');
            localStorage.removeItem('hasSession');
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    };

    const register = async (nickname: string, email: string, password: string) => {
        try {
            await axios.post(REGISTER_URL, { nickname, email, password });
            if (tempScore) {
                const { scoreData, gameId, slug } = tempScore;

                await handleScoreUpload({
                    scoreData,
                    gameId,
                    slug,
                });

                clearTempScore();
            }
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (tempScore) {
            const handleBeforeUnload = (event: BeforeUnloadEvent) => {
                event.preventDefault();
            };
            window.addEventListener('beforeunload', handleBeforeUnload);
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }
    }, [tempScore]);

    return (
        <AuthContext.Provider value={{ ...authState, login, logout, register }}>
            {!authState.loading && children}
        </AuthContext.Provider>
    );
};

export { AuthContext };
