import { Routes, Route, Navigate } from 'react-router';
import ProtectedRoute from '@/features/auth/protectedRoute.jsx';
import DashboardLayout from '@/layouts/DashboardLayout.jsx';
import LoginPage from '@/features/auth/LoginPage.jsx';
import RegisterPage from '@/features/auth/RegisterPage.jsx';
import DashboardPage from '@/features/dashboard/DashboardPage.jsx';
import ProjectList from '@/features/projects/ProjectList.jsx';
import ProjectDetails from '@/features/projects/ProjectDetails.jsx';
import { FiCheckSquare } from 'react-icons/fi';

const DashboardPlaceholder = () => (
  <div className="h-full flex flex-col items-center justify-center text-maroon/50 animate-in fade-in zoom-in-95 duration-500">
    <FiCheckSquare className="text-6xl mb-4 opacity-50" />
    <p className="font-medium">Select a route from the sidebar to view features.</p>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
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
