import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical, FiClock, FiEdit2, FiTrash2, FiArchive, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import { useDeleteProjectMutation, useArchiveProjectMutation, useUpdateProjectMutation } from './projectsApi';
import ProjectFormModal from './ProjectFormModal';
import { toast } from 'react-toastify';

const statusColors = {
  PLANNING: 'bg-secondary text-secondary-foreground',
  IN_PROGRESS: 'bg-accent/20 text-accent-foreground border border-accent/30',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

const priorityColors = {
  LOW: 'text-muted-foreground',
  MEDIUM: 'text-amber-600',
  HIGH: 'text-destructive font-bold',
};

const ProjectCard = ({ project }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const menuRef = useRef(null);

  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();
  const [archiveProject, { isLoading: isArchiving }] = useArchiveProjectMutation();
  const [updateProject, { isLoading: isRestoring }] = useUpdateProjectMutation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Owner check: compare string IDs safely
  const isOwner =
    currentUser?.role === 'ADMIN' ||
    project.owner === currentUser?._id ||
    project.owner?._id === currentUser?._id;

  const statusColor = statusColors[project.status] || statusColors.PLANNING;
  const priorityColor = priorityColors[project.priority] || priorityColors.MEDIUM;
  const formattedDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString()
    : 'No due date';

  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (!window.confirm(`Are you sure you want to permanently delete "${project.name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project._id).unwrap();
      toast.success('Project deleted successfully.');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete project.');
    }
  };

  const handleArchive = async () => {
    setIsMenuOpen(false);
    if (!window.confirm(`Archive "${project.name}"? It will be hidden from active projects.`)) return;
    try {
      await archiveProject(project._id).unwrap();
      toast.success('Project archived.');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to archive project.');
    }
  };

  const handleRestore = async () => {
    setIsMenuOpen(false);
    try {
      await updateProject({ id: project._id, status: 'PLANNING' }).unwrap();
      toast.success('Project restored to Planning.');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to restore project.');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full relative">
      {/* Top row: status badge + owner actions */}
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
          {project.status.replace('_', ' ')}
        </span>

        {/* Owner-only actions menu */}
        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.preventDefault(); setIsMenuOpen((v) => !v); }}
              className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md"
              title="Project actions"
            >
              <FiMoreVertical />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-8 z-30 bg-card border border-border rounded-lg shadow-xl py-1 w-44 animate-in fade-in zoom-in-95 duration-100" style={{ isolation: 'isolate' }}>
                <button
                  onClick={() => { setIsMenuOpen(false); setIsEditModalOpen(true); }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
                >
                  <FiEdit2 className="text-accent" /> Edit Project
                </button>
                {project.status === 'ARCHIVED' ? (
                  <button
                    onClick={handleRestore}
                    disabled={isRestoring}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <FiRefreshCw className="text-emerald-500" /> Restore Project
                  </button>
                ) : (
                  <button
                    onClick={handleArchive}
                    disabled={isArchiving}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    <FiArchive className="text-amber-500" /> Archive
                  </button>
                )}
                <div className="border-t border-border my-1" />
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <FiTrash2 /> Delete Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1">{project.name}</h3>
      <p className="text-xs font-semibold mb-1 {priorityColor}">
        <span className={priorityColor}>{project.priority}</span> priority
      </p>

      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-grow">
        {project.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center text-xs text-muted-foreground font-medium">
          <FiClock className="mr-1.5" />
          {formattedDate}
        </div>
        <Link
          to={`/projects/${project._id}`}
          className="text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
        >
          View Details →
        </Link>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ProjectFormModal
          onClose={() => setIsEditModalOpen(false)}
          projectToEdit={project}
        />
      )}
    </div>
  );
};

export default ProjectCard;
