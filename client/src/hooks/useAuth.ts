import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
