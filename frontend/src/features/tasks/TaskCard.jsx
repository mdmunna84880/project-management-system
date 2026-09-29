import { FiClock, FiEdit2, FiTrash2, FiUser, FiChevronDown } from 'react-icons/fi';
import { useDeleteTaskMutation, useUpdateTaskStatusMutation } from './tasksApi';
import { toast } from 'react-toastify';

const statusColors = {
  TODO: 'bg-muted text-muted-foreground',
  IN_PROGRESS: 'bg-accent/20 text-accent-foreground border border-accent/30',
  REVIEW: 'bg-amber-100 text-amber-800 border border-amber-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
};

const priorityColors = {
  LOW: 'text-muted-foreground',
  MEDIUM: 'text-accent',
  HIGH: 'text-orange-500',
  CRITICAL: 'text-destructive font-bold',
};

const TaskCard = ({ task, onEdit, projectId }) => {
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTaskStatusMutation();
  const statusColor = statusColors[task.status] || statusColors.TODO;
  const priorityColor = priorityColors[task.priority] || priorityColors.MEDIUM;

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString()
    : 'No due date';

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask({ id: task._id, projectId }).unwrap();
        toast.success('Task deleted successfully!');
      } catch (err) {
        console.error('Failed to delete task:', err);
        toast.error(err?.data?.message || 'Failed to delete task.');
      }
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateStatus({ id: task._id, projectId, status: newStatus }).unwrap();
      // Toast is optional here since UI is optimistic, but good for confirmation
      toast.success('Task status updated');
    } catch (err) {
      toast.error('Failed to update status. Changes reverted.');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative">
            <select
              value={task.status}
              onChange={handleStatusChange}
              disabled={isUpdating}
              className={`appearance-none text-[10px] font-bold px-2 py-0.5 pr-5 rounded-full cursor-pointer outline-none ${statusColor} ${isUpdating ? 'opacity-50' : ''}`}
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="REVIEW">REVIEW</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <FiChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none opacity-70" />
          </div>
          {task.isOverdue && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 shadow-sm animate-pulse">
              OVERDUE
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-muted-foreground hover:text-accent rounded-md hover:bg-accent/10 transition-colors"
          >
            <FiEdit2 className="text-sm" />
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md hover:bg-destructive/10 transition-colors"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-bold text-foreground mb-1.5 line-clamp-2">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-grow">
          {task.description}
        </p>
      )}

      <div className="mt-auto pt-3 flex items-center justify-between border-t border-border/50">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold ${priorityColor}`}>
            {task.priority}
          </span>
          <span className="flex items-center text-xs text-muted-foreground font-medium">
            <FiClock className="mr-1" />
            {formattedDate}
          </span>
        </div>
        
        {task.assignedTo ? (
          <div 
            className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-[10px] font-bold"
            title={`Assigned to ${task.assignedTo.name || 'User'}`}
          >
            {(task.assignedTo.name || 'U').charAt(0).toUpperCase()}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground" title="Unassigned">
            <FiUser className="text-[10px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
