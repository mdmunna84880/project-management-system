import { useState } from 'react';
import { useGetProjectsQuery } from './projectsApi';
import ProjectCard from './ProjectCard';
import { FiPlus, FiArchive, FiEye, FiEyeOff } from 'react-icons/fi';
import ProjectFormModal from './ProjectFormModal';

const ProjectList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const { data: response, isLoading, error } = useGetProjectsQuery({ includeArchived: showArchived });

  const projects = response?.data?.projects || [];
  const archivedCount = projects.filter((p) => p.status === 'ARCHIVED').length;
  const activeCount = projects.filter((p) => p.status !== 'ARCHIVED').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm font-medium border border-destructive/20">
        Unable to load projects. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Your Projects</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            {showArchived
              ? `Showing all projects including archived (${archivedCount} archived)`
              : `${activeCount} active project${activeCount !== 1 ? 's' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Archived */}
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold border transition-colors ${
              showArchived
                ? 'bg-muted text-foreground border-border'
                : 'text-muted-foreground border-border hover:bg-secondary hover:text-foreground'
            }`}
            title={showArchived ? 'Hide archived projects' : 'Show archived projects'}
          >
            {showArchived ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
            <FiArchive className="text-base" />
            {showArchived ? 'Hide Archived' : 'Show Archived'}
          </button>

          {/* New Project (mobile only — desktop has header button) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="md:hidden bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <FiPlus className="text-lg" /> New
          </button>
        </div>
      </div>

      {/* Empty state */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-full mb-4">
            <FiPlus className="text-2xl text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
          <p className="text-muted-foreground mt-1 text-center max-w-sm text-sm">
            {showArchived
              ? 'No archived projects found.'
              : 'Get started by creating a new project.'}
          </p>
          {!showArchived && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      {isModalOpen && <ProjectFormModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ProjectList;
