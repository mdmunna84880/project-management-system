import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { FiHome, FiCheckSquare, FiBell, FiSettings, FiMenu, FiLogOut, FiPlus, FiUser, FiX, FiList, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import { useSelector } from 'react-redux';
import { useGetNotificationsQuery } from '@/features/notifications/notificationsApi';
import { useLogoutMutation } from '@/features/auth/authApi';
import ProjectFormModal from '@/features/projects/ProjectFormModal';
import { toast } from 'react-toastify';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'My Tasks',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: notifData } = useGetNotificationsQuery(undefined, { pollingInterval: 60000 });
  const unreadCount = notifData?.data?.unreadCount || 0;

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed. Please try again.');
    }
  };

  // Derive page title: handle dynamic routes like /projects/:id
  const pageTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[1] || 'Project Details';

  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-sm shrink-0">
            P
          </div>
          <h1 className="text-base font-bold tracking-wide text-foreground leading-tight">
            Project Mgmt<br /><span className="text-accent text-sm font-semibold">System</span>
          </h1>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          <NavItem icon={<FiHome />} label="Dashboard" to="/" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<FiCheckSquare />} label="Projects" to="/projects" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem icon={<FiList />} label="My Tasks" to="/tasks" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem
            icon={<FiBell />}
            label="Notifications"
            to="/notifications"
            badge={unreadCount > 0 ? unreadCount : null}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavItem icon={<FiSettings />} label="Settings" to="/settings" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>
      </div>

      {/* User Profile + Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-border shadow-inner shrink-0">
            <span className="text-primary-foreground text-xs font-bold">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground font-medium truncate">{user?.role === 'ADMIN' ? 'Administrator' : 'Member'}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Logout"
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
          >
            <FiLogOut className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-accent/30">

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border hidden md:flex flex-col bg-card sticky top-0 h-screen z-10">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative w-64 h-full bg-card border-r border-border flex flex-col z-50 shadow-xl">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
            >
              <FiX className="text-xl" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Header */}
        <header className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <FiMenu className="text-xl" />
            </button>
            <h2 className="text-lg font-bold text-foreground tracking-tight">{pageTitle}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* New Project button — visible on all pages */}
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
            >
              <FiPlus className="text-base" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-muted-foreground hover:bg-secondary rounded-md transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
            </button>

            {/* Mobile user avatar */}
            <div className="md:hidden w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-border">
              <span className="text-primary-foreground text-xs font-bold">{userInitials}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto relative z-0">
          <Outlet />
        </div>
      </main>

      {/* Global New Project Modal */}
      {isProjectModalOpen && (
        <ProjectFormModal onClose={() => setIsProjectModalOpen(false)} />
      )}
    </div>
  );
}

function NavItem({ icon, label, to, badge, onClick }) {
  const location = useLocation();
  const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to) && to !== '/';
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-md mb-1 transition-all group ${
        active ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${active ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'}`}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          {badge}
        </span>
      )}
    </Link>
  );
}
