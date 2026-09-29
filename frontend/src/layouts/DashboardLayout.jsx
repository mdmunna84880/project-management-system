import { Outlet, Link, useLocation } from 'react-router';
import { FiHome, FiCheckSquare, FiBell, FiSettings, FiMenu, FiSearch, FiPlus } from 'react-icons/fi';
import { useGetNotificationsQuery } from '@/features/notifications/notificationsApi';

export default function DashboardLayout() {
  const { data } = useGetNotificationsQuery(undefined, { pollingInterval: 60000 }); // Poll every minute
  const unreadCount = data?.data?.unreadCount || 0;

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-accent/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col justify-between hidden md:flex bg-card sticky top-0 h-screen z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold shadow-sm transition-all duration-300 shrink-0">
              P
            </div>
            <h1 className="text-base font-bold tracking-wide text-foreground leading-tight">Project Management<br/><span className="text-accent text-sm font-semibold">System</span></h1>
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<FiHome />} label="Dashboard" to="/" />
            <NavItem icon={<FiCheckSquare />} label="Projects" to="/projects" />
            <NavItem 
              icon={<FiBell />} 
              label="Notifications" 
              to="/notifications" 
              badge={unreadCount > 0 ? unreadCount : null} 
            />
          </nav>
        </div>
        
        <div className="p-6 border-t border-border">
          <NavItem icon={<FiSettings />} label="Settings" to="/settings" />
          
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-border shadow-inner">
              <span className="text-primary-foreground text-sm font-bold">JD</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground font-medium">Senior Engineer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-background">
        {/* Header */}
        <header className="h-20 border-b border-border px-8 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
              <FiMenu className="text-2xl" />
            </button>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Overview</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-input border border-border rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-all w-64 placeholder:text-muted-foreground text-foreground"
              />
            </div>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-md text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
              <FiPlus className="text-lg" /> New Project
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1 overflow-y-auto relative z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, to, badge }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-3 py-2.5 rounded-md mb-1 transition-all group ${active ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium'}`}>
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
