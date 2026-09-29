import Notification from '../models/Notification.js';
import notificationService from '../services/notificationService.js';
import { ApiError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getNotifications = async (req, res) => {
    await notificationService.generateDueSoonNotifications(req.user._id);

    const notifications = await Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(200).json(new ApiResponse(200, { notifications, unreadCount }, 'Notifications fetched'));
};

const markAsRead = async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, 'Notification not found');
    }

    res.status(200).json(new ApiResponse(200, { notification }, 'Notification marked as read'));
};

const markAllAsRead = async (req, res) => {
    await Notification.updateMany(
        { user: req.user._id, isRead: false },
        { isRead: true }
    );

    res.status(200).json(new ApiResponse(200, null, 'All notifications marked as read'));
};

export { getNotifications, markAsRead, markAllAsRead };