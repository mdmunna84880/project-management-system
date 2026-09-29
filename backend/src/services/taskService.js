import Task from '../models/Task.js';

const getFilteredTasks = async (projectId, query) => {
  const {
    search,
    status,
    priority,
    assignedTo,
    dueBefore,
    dueAfter,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const filter = { project: projectId };

  if (search) {
    filter.title = { $regex: search, $options: 'i' };
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignedTo) filter.assignedTo = assignedTo;

  if (dueBefore || dueAfter) {
    filter.dueDate = {};
    if (dueAfter) filter.dueDate.$gte = new Date(dueAfter);
    if (dueBefore) filter.dueDate.$lte = new Date(dueBefore);
  }

  // ensure valid pagination boundaries
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const sortOption = {
    [sortBy]: sortOrder === 'desc' ? -1 : 1
  };

  // run query and count simultaneously
  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('assignedTo', 'name email'),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      totalRecords: total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  };
};

export { getFilteredTasks };