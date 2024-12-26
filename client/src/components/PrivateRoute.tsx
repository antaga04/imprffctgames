import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/ui/Loading';

const PrivateRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <Loading />;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return <Outlet />;
};

export default PrivateRoute;
