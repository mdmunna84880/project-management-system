import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useGetMyTasksQuery } from './tasksApi';
import TaskCard from './TaskCard';
import Pagination from './Pagination';
import { FiList, FiFilter } from 'react-icons/fi';

const STATUS_OPTIONS = ['', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'];
const PRIORITY_OPTIONS = ['', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const MyTasksPage = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const { data: response, isLoading, isError, isFetching } = useGetMyTasksQuery(
    { status, priority, page, limit: 15 },
    { skip: !currentUser }
  );

  const tasks = response?.data?.tasks || [];
  const pagination = response?.data?.pagination;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FiList /> My Tasks
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tasks assigned to you across all your projects.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-xl p-4">
        <FiFilter className="text-muted-foreground" />
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="bg-input border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-ring transition-colors"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => { setPriority(e.target.value); setPage(1); }}
          className="bg-input border border-border rounded-md px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-ring transition-colors"
        >
          <option value="">All Priorities</option>
          {PRIORITY_OPTIONS.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {(status || priority) && (
          <button
            onClick={() => { setStatus(''); setPriority(''); setPage(1); }}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors font-semibold underline"
          >
            Clear filters
          </button>
        )}
        {pagination && (
          <span className="ml-auto text-xs text-muted-foreground font-medium">
            {pagination.totalRecords} task(s)
          </span>
        )}
      </div>

      {/* Task Grid */}
      <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary" />
          </div>
        ) : isError ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm font-medium border border-destructive/20">
            Unable to load tasks. Please try again.
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl text-center">
            <FiList className="text-5xl text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {status || priority ? 'Try adjusting your filters.' : "You don't have any tasks assigned yet."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <div key={task._id}>
                  {/* Show project name as context header */}
                  <p className="text-xs text-muted-foreground font-semibold mb-1.5 truncate">
                    📁 {task.project?.name || 'Unknown Project'}
                  </p>
                  <TaskCard task={task} projectId={task.project?._id} onEdit={() => {}} />
                </div>
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;
