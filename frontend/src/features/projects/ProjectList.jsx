import { useState } from 'react';
import { useGetProjectsQuery } from './projectsApi';
import ProjectCard from './ProjectCard';
import { FiPlus } from 'react-icons/fi';
import ProjectFormModal from './ProjectFormModal';

const ProjectList = () => {
  const { data: response, isLoading, error } = useGetProjectsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects = response?.data?.projects || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive p-4 rounded-md text-sm font-medium border border-destructive/20">
        Error loading projects. Please make sure the backend is running and you are authenticated.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Your Projects</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage and track your team's initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="md:hidden bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
        >
          <FiPlus className="text-lg" /> New
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-card border border-border rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-secondary flex items-center justify-center rounded-full mb-4">
            <FiPlus className="text-2xl text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
          <p className="text-muted-foreground mt-1 text-center max-w-sm text-sm">
            Get started by creating a new project to organize your tasks.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
          >
            Create Project
          </button>
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
