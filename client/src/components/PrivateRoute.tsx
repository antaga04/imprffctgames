import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const PrivateRoute: React.FC = () => {
    const { t } = useTranslation();
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Loading />;
    if (!isAuthenticated) {
        toast.warning(t('auth.login_required'));
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
