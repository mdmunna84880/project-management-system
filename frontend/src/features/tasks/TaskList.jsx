import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useGetTasksQuery } from './tasksApi';
import TaskCard from './TaskCard';
import TaskFormModal from './TaskFormModal';
import TaskFilters from './TaskFilters';
import Pagination from './Pagination';
import { FiPlus } from 'react-icons/fi';

const TaskList = ({ projectId }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Convert searchParams to an object to pass to RTK Query
  const queryParams = useMemo(() => {
    const params = { projectId };
    for (const [key, value] of searchParams.entries()) {
      if (value) params[key] = value;
    }
    return params;
  }, [searchParams, projectId]);

  const { data: response, isLoading, error, isFetching } = useGetTasksQuery(queryParams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const tasks = response?.data?.tasks || [];
  const pagination = response?.data?.pagination;

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-64 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm font-medium border border-destructive/20">
        Error loading tasks. You might not have permission.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-5 py-4 border-b border-border flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Tasks</h3>
            <p className="text-xs text-muted-foreground font-medium">
              {pagination ? `${pagination.totalRecords} total task(s)` : `${tasks.length} total task(s)`}
            </p>
          </div>
          <button 
            onClick={handleOpenCreateModal}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-md text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <FiPlus /> New Task
          </button>
        </div>
        <TaskFilters projectId={projectId} />
      </div>

      <div className={`p-5 flex-grow overflow-y-auto custom-scrollbar transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
        {tasks.length === 0 ? (
          <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-muted-foreground text-center">
            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3">
              <FiPlus className="text-xl" />
            </div>
            <p className="font-semibold text-foreground">No tasks yet</p>
            <p className="text-sm mt-1 max-w-[250px]">Create a task to start tracking work for this project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map(task => (
              <TaskCard 
                key={task._id} 
                task={task} 
                projectId={projectId}
                onEdit={handleOpenEditModal} 
              />
            ))}
          </div>
        )}
        
        {pagination && (
          <Pagination 
            currentPage={pagination.currentPage} 
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {isModalOpen && (
        <TaskFormModal 
          onClose={() => setIsModalOpen(false)} 
          projectId={projectId}
          taskToEdit={taskToEdit}
        />
      )}
    </div>
  );
};

export default TaskList;
