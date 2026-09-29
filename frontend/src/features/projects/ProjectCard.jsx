import { FiMoreVertical, FiClock, FiCheckSquare } from 'react-icons/fi';
import { Link } from 'react-router';

const statusColors = {
  PLANNING: 'bg-secondary text-secondary-foreground',
  IN_PROGRESS: 'bg-accent/20 text-accent-foreground border border-accent/30',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  ARCHIVED: 'bg-muted text-muted-foreground',
};

const ProjectCard = ({ project }) => {
  const statusColor = statusColors[project.status] || statusColors.PLANNING;
  const formattedDate = project.dueDate 
    ? new Date(project.dueDate).toLocaleDateString()
    : 'No due date';

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
          {project.status.replace('_', ' ')}
        </span>
        <button className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <FiMoreVertical />
        </button>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">
        {project.name}
      </h3>
      
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
    </div>
  );
};

export default ProjectCard;
