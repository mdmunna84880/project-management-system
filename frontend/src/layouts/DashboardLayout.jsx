import { Outlet, Link, useLocation } from 'react-router';
import { FiHome, FiCheckSquare, FiBell, FiSettings, FiMenu, FiSearch, FiPlus } from 'react-icons/fi';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-ink-black text-pearl-aqua font-sans selection:bg-turquoise/30">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-dusty-lavender/20 flex flex-col justify-between hidden md:flex backdrop-blur-xl bg-ink-black/80 sticky top-0 h-screen z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-turquoise to-pearl-aqua flex items-center justify-center text-ink-black font-bold shadow-[0_0_15px_rgba(113,222,207,0.4)] group-hover:shadow-[0_0_25px_rgba(113,222,207,0.6)] transition-all duration-300 shrink-0">
              P
            </div>
            <h1 className="text-base font-semibold tracking-wide text-white leading-tight">Project Management<br/><span className="text-turquoise text-sm">System</span></h1>
          </div>
          
          <nav className="space-y-1">
            <NavItem icon={<FiHome />} label="Dashboard" to="/" />
            <NavItem icon={<FiCheckSquare />} label="Tasks" to="/tasks" />
            <NavItem icon={<FiBell />} label="Notifications" to="/notifications" badge="3" />
          </nav>
        </div>
        
        <div className="p-6 border-t border-dusty-lavender/20">
          <NavItem icon={<FiSettings />} label="Settings" to="/settings" />
          
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-crimson-violet flex items-center justify-center border-2 border-dusty-lavender/30 shadow-inner">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">John Doe</p>
              <p className="text-xs text-dusty-lavender">Senior Engineer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-crimson-violet/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-turquoise/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <header className="h-20 border-b border-dusty-lavender/20 px-8 flex items-center justify-between backdrop-blur-md bg-ink-black/50 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-dusty-lavender hover:text-white transition-colors">
              <FiMenu className="text-2xl" />
            </button>
            <h2 className="text-2xl font-medium text-white tracking-tight">Overview</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block group">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dusty-lavender group-focus-within:text-turquoise transition-colors" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-ink-black/50 border border-dusty-lavender/30 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-turquoise focus:ring-1 focus:ring-turquoise/50 transition-all w-64 placeholder:text-dusty-lavender/70 text-white"
              />
            </div>
            <button className="bg-pearl-aqua hover:bg-turquoise text-ink-black px-5 py-2 rounded-full text-sm font-bold shadow-[0_4px_14px_0_rgba(113,222,207,0.39)] hover:shadow-[0_6px_20px_rgba(113,222,207,0.23)] hover:-translate-y-0.5 transition-all flex items-center gap-2">
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
    <Link to={to} className={`flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition-all group ${active ? 'bg-dusty-lavender/20 text-white' : 'text-pearl-aqua hover:bg-dusty-lavender/10 hover:text-white'}`}>
      <div className="flex items-center gap-3">
        <span className={`text-lg transition-transform duration-300 group-hover:scale-110 ${active ? 'text-turquoise' : 'text-dusty-lavender group-hover:text-pearl-aqua'}`}>
          {icon}
        </span>
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge && (
        <span className="bg-crimson-violet text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(141,26,73,0.6)]">
          {badge}
        </span>
      )}
    </Link>
  );
}
