import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import { toast } from 'sonner';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Loading />;
    if (!isAuthenticated) {
        toast.warning('Login to access the page.');
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
