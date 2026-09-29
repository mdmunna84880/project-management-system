import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from './projectSchemas';
import { useCreateProjectMutation, useUpdateProjectMutation } from './projectsApi';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProjectFormModal = ({ onClose, projectToEdit }) => {
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const isEditMode = !!projectToEdit;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: projectToEdit || {
      name: '',
      description: '',
      status: 'PLANNING',
      priority: 'MEDIUM',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateProject({ id: projectToEdit._id, ...data }).unwrap();
        toast.success('Project updated successfully!');
      } else {
        await createProject(data).unwrap();
        toast.success('Project created successfully!');
      }
      onClose();
    } catch (err) {
      console.error('Failed to save project:', err);
      toast.error(err?.data?.message || 'Failed to save project.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">
            {isEditMode ? 'Edit Project' : 'Create New Project'}
          </h3>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Project Name</label>
            <input 
              {...register('name')}
              type="text" 
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground"
              placeholder="e.g., Q3 Marketing Campaign"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Description (Optional)</label>
            <textarea 
              {...register('description')}
              rows="3"
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground resize-none"
              placeholder="What is this project about?"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
              <select 
                {...register('status')}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors appearance-none"
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Priority</label>
              <select 
                {...register('priority')}
                className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors appearance-none"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Due Date</label>
            <input 
              {...register('dueDate')}
              type="date" 
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring transition-colors"
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-destructive font-medium">{errors.dueDate.message}</p>
            )}
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md text-sm font-bold transition-colors shadow-sm disabled:opacity-70 flex items-center"
            >
              {isLoading ? (
                <div className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
              ) : null}
              {isEditMode ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectFormModal;
