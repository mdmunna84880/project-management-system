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
      <div className="min-h-screen flex items-center justify-center bg-ink-black text-pearl-aqua">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-turquoise border-r-pearl-aqua border-b-dusty-lavender border-l-crimson-violet animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Authenticating...</p>
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