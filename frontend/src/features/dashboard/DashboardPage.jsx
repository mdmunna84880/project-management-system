import { useGetDashboardStatsQuery } from './dashboardApi';
import { FiActivity, FiCheckCircle, FiClock, FiAlertCircle, FiFolder, FiRefreshCw } from 'react-icons/fi';

const StatCard = ({ icon, label, value, colorClass }) => (
  <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const { data: response, isLoading, isError, refetch } = useGetDashboardStatsQuery();
  
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading dashboard…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
          <FiAlertCircle className="text-destructive text-2xl" />
        </div>
        <p className="font-semibold text-foreground text-lg">Unable to load dashboard</p>
        <p className="text-sm text-muted-foreground">The server may be down or you may have lost your connection.</p>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <FiRefreshCw /> Try again
        </button>
      </div>
    );
  }

  const { projects, tasks, projectProgress } = response?.data || {};

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Overview Stats */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Task Overview</h3>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">
            Across {projects?.active || 0} active projects
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<FiActivity className="text-xl" />} 
            label="Total Tasks" 
            value={tasks?.total || 0}
            colorClass="bg-blue-100 text-blue-700"
          />
          <StatCard 
            icon={<FiCheckCircle className="text-xl" />} 
            label="Completed" 
            value={tasks?.completed || 0}
            colorClass="bg-emerald-100 text-emerald-700"
          />
          <StatCard 
            icon={<FiClock className="text-xl" />} 
            label="Pending" 
            value={tasks?.pending || 0}
            colorClass="bg-amber-100 text-amber-700"
          />
          <StatCard 
            icon={<FiAlertCircle className="text-xl" />} 
            label="Overdue" 
            value={tasks?.overdue || 0}
            colorClass="bg-red-100 text-red-700"
          />
        </div>
      </section>

      {/* Project Progress */}
      <section>
        <h3 className="text-lg font-bold text-foreground mb-4">Project Progress</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(!projectProgress || projectProgress.length === 0) ? (
             <div className="col-span-full p-8 text-center text-muted-foreground bg-card border border-border rounded-xl">
               No active projects found. Create a project to see progress here!
             </div>
          ) : (
            projectProgress.map(p => (
              <div key={p.projectId} className="bg-card border border-border p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2 truncate pr-4">
                    <FiFolder className="text-accent shrink-0" /> 
                    <span className="truncate">{p.projectName}</span>
                  </h4>
                  <span className="text-sm font-bold text-primary shrink-0">{p.progressPercentage}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${p.progressPercentage}%` }}
                  ></div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground flex justify-between font-medium">
                  <span>{p.completed} completed</span>
                  <span>{p.total} total tasks</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
};

export default DashboardPage;
