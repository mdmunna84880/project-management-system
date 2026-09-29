import { Navigate, Outlet, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useGetMeQuery } from './authApi';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  
  const { isLoading, isFetching } = useGetMeQuery(undefined, {
    skip: isAuthenticated,
  });

  const isAuthLoading = isLoading || isFetching;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent border-r-foreground/30 border-b-border animate-spin"></div>
          <p className="text-sm font-bold tracking-wide">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;