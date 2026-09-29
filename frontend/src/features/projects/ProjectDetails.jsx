import { useParams, Link } from 'react-router';
import { useGetProjectByIdQuery } from './projectsApi';
import MembersPanel from '../members/MembersPanel';
import { FiArrowLeft, FiClock, FiCheckSquare } from 'react-icons/fi';

const statusColors = {
  PLANNING: 'bg-secondary text-secondary-foreground',
  IN_PROGRESS: 'bg-accent/20 text-accent-foreground border border-accent/30',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

const ProjectDetails = () => {
  const { id } = useParams();
  const { data: response, isLoading, error } = useGetProjectByIdQuery(id);

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
        Error loading project details. It may not exist or you don't have access.
      </div>
    );
  }

  const project = response?.data?.project;
  if (!project) return null;

  const statusColor = statusColors[project.status] || statusColors.PLANNING;
  const formattedDate = project.dueDate 
    ? new Date(project.dueDate).toLocaleDateString()
    : 'No due date';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground bg-card border border-border shadow-sm">
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            {project.name}
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
              {project.status.replace('_', ' ')}
            </span>
          </h2>
          <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4 font-medium">
            <span className="flex items-center gap-1.5"><FiClock /> {formattedDate}</span>
            <span className="flex items-center gap-1.5 text-accent"><FiCheckSquare /> Priority: {project.priority}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-2">Description</h3>
        <p className="text-sm text-foreground/80 whitespace-pre-wrap">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-muted-foreground">
            <FiCheckSquare className="text-4xl mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-foreground mb-1">Tasks</h3>
            <p className="font-medium text-sm text-center">Task Management (Coming Soon - Phase 4)</p>
          </div>
        </div>
        <div className="xl:col-span-1">
          <MembersPanel projectId={project._id} projectOwnerId={project.owner} />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
