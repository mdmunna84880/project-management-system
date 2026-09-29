import Notification from '../models/Notification.js';
import Task from '../models/Task.js';

const createNotification = async ({ user, type, message, relatedProject, relatedTask }) => {
  try {
    await Notification.create({ user, type, message, relatedProject, relatedTask });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

const generateDueSoonNotifications = async (userId) => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const dueSoonTasks = await Task.find({
    assignedTo: userId,
    status: { $ne: 'COMPLETED' },
    dueDate: { $gte: now, $lte: tomorrow },
  });

  for (const task of dueSoonTasks) {
    const exists = await Notification.findOne({
      user: userId,
      relatedTask: task._id,
      type: 'TASK_DUE_SOON',
    });

    if (!exists) {
      await createNotification({
        user: userId,
        type: 'TASK_DUE_SOON',
        message: `Task "${task.title}" is due in less than 24 hours.`,
        relatedTask: task._id,
        relatedProject: task.project,
      });
    }
  }
};

export default { createNotification, generateDueSoonNotifications };