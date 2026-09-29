import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from './taskSchemas';
import { useCreateTaskMutation, useUpdateTaskMutation } from './tasksApi';
import { useGetMembersQuery } from '../members/membersApi';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const TaskFormModal = ({ onClose, projectId, taskToEdit }) => {
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const { data: membersResponse, isLoading: isLoadingMembers } = useGetMembersQuery(projectId);
  
  const members = membersResponse?.data?.members || [];
  const isEditMode = !!taskToEdit;
  const isLoading = isCreating || isUpdating;

  // Format date for the input
  const defaultDueDate = taskToEdit?.dueDate 
    ? new Date(taskToEdit.dueDate).toISOString().split('T')[0]
    : '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: taskToEdit?.title || '',
      description: taskToEdit?.description || '',
      status: taskToEdit?.status || 'TODO',
      priority: taskToEdit?.priority || 'MEDIUM',
      dueDate: defaultDueDate,
      assignedTo: taskToEdit?.assignedTo?._id || taskToEdit?.assignedTo || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateTask({ id: taskToEdit._id, projectId, ...data }).unwrap();
        toast.success('Task updated successfully!');
      } else {
        await createTask({ projectId, ...data }).unwrap();
        toast.success('Task created successfully!');
      }
      onClose();
    } catch (err) {
      console.error('Failed to save task:', err);
      toast.error(err?.data?.message || 'Failed to save task due to a server error.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            {isEditMode ? 'Edit Task' : 'Create New Task'}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Task Title</label>
            <input 
              {...register('title')}
              type="text" 
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              placeholder="e.g., Update database schema"
            />
            {errors.title && <p className="mt-1 text-xs text-destructive font-medium">{errors.title.message}</p>}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Description (Optional)</label>
            <textarea 
              {...register('description')}
              rows="3"
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors resize-none"
              placeholder="What needs to be done?"
            />
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
              <select 
                {...register('status')}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Priority</label>
              <select 
                {...register('priority')}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Due Date</label>
              <input 
                {...register('dueDate')}
                type="date" 
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
              />
              {errors.dueDate && <p className="mt-1 text-xs text-destructive font-medium">{errors.dueDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Assign To</label>
              <select 
                {...register('assignedTo')}
                disabled={isLoadingMembers}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors disabled:opacity-50"
              >
                <option value="">Unassigned</option>
                {members.map(member => (
                  <option key={member.user._id} value={member.user._id}>
                    {member.user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md text-sm font-bold transition-colors shadow-sm flex items-center disabled:opacity-70"
            >
              {isLoading && <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />}
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
