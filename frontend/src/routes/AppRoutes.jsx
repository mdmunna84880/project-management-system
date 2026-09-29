import { Routes, Route, Navigate } from 'react-router';
import ProtectedRoute from '../features/auth/protectedRoute.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { FiCheckSquare, FiLogIn } from 'react-icons/fi';

const LoginPlaceholder = () => (
  <div className="min-h-screen flex items-center justify-center bg-ink-black relative overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-crimson-violet/20 blur-[120px] rounded-full pointer-events-none" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-turquoise/10 blur-[100px] rounded-full pointer-events-none" />
    <div className="z-10 bg-ink-black/80 backdrop-blur-md p-10 rounded-2xl border border-dusty-lavender/20 shadow-2xl flex flex-col items-center w-full max-w-md">
      <FiLogIn className="text-5xl text-turquoise mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
      <p className="text-dusty-lavender mb-6 text-sm">Please log in to continue to your dashboard.</p>
      {/* Auth form placeholder */}
      <div className="w-full h-10 bg-dusty-lavender/10 rounded-lg animate-pulse mb-3" />
      <div className="w-full h-10 bg-dusty-lavender/10 rounded-lg animate-pulse mb-6" />
      <div className="w-full h-10 bg-turquoise/20 rounded-lg animate-pulse" />
    </div>
  </div>
);

const DashboardPlaceholder = () => (
  <div className="h-full flex flex-col items-center justify-center text-dusty-lavender animate-in fade-in zoom-in-95 duration-500">
    <FiCheckSquare className="text-6xl mb-4 opacity-30" />
    <p>Select a route from the sidebar to view features.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPlaceholder />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPlaceholder />} />
          <Route path="/tasks" element={<DashboardPlaceholder />} />
          <Route path="/notifications" element={<DashboardPlaceholder />} />
          <Route path="/settings" element={<DashboardPlaceholder />} />
        </Route>
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
