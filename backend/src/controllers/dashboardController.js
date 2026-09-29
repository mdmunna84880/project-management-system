import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import Task from '../models/Task.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getDashboardStats = async (req, res) => {
  let projectIds = [];
  
  if (req.user.role === 'ADMIN') {
    const projects = await Project.find().select('_id');
    projectIds = projects.map(p => p._id);
  } else {
    const memberships = await ProjectMember.find({ user: req.user._id }).select('project');
    projectIds = memberships.map(m => m.project);
  }

  // fast path for users with no assigned projects
  if (projectIds.length === 0) {
    return res.status(200).json(new ApiResponse(200, {
      projects: { total: 0, active: 0, completed: 0 },
      tasks: { total: 0, pending: 0, completed: 0, overdue: 0, highPriority: 0 },
      projectProgress: []
    }, 'Dashboard stats fetched successfully'));
  }

  const projects = await Project.find({ _id: { $in: projectIds } });
  const projectStats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'PLANNING').length,
    completed: projects.filter(p => p.status === 'COMPLETED').length
  };

  const now = new Date();

  const taskAggregations = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $ne: ["$status", "COMPLETED"] }, 1, 0] } },
        highPriority: { $sum: { $cond: [{ $in: ["$priority", ["HIGH", "CRITICAL"]] }, 1, 0] } },
        overdue: {
          $sum: {
            $cond: [
              { $and: [{ $lt: ["$dueDate", now] }, { $ne: ["$status", "COMPLETED"] }] }, 1, 0
            ]
          }
        }
      }
    }
  ]);

  const taskStats = taskAggregations[0] || {
    total: 0, completed: 0, pending: 0, highPriority: 0, overdue: 0
  };
  delete taskStats._id;

  const progressAggregations = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    {
      $group: {
        _id: "$project",
        totalTasks: { $sum: 1 },
        completedTasks: { $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] } }
      }
    }
  ]);

  const projectProgress = projects.map(project => {
    const stat = progressAggregations.find(p => p._id.toString() === project._id.toString());
    const total = stat ? stat.totalTasks : 0;
    const completed = stat ? stat.completedTasks : 0;
    const progressPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      projectId: project._id,
      projectName: project.name,
      total,
      completed,
      progressPercentage
    };
  });

  res.status(200).json(new ApiResponse(200, {
    projects: projectStats,
    tasks: taskStats,
    projectProgress
  }, 'Dashboard stats fetched successfully'));
};