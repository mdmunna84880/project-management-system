import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from './notificationsApi';
import { FiBell, FiCheck, FiCheckCircle, FiUserPlus, FiAlertTriangle, FiCheckSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';

const notificationIcons = {
  MEMBER_ADDED: <FiUserPlus className="text-blue-500 text-xl" />,
  TASK_ASSIGNED: <FiCheckSquare className="text-purple-500 text-xl" />,
  TASK_COMPLETED: <FiCheckCircle className="text-emerald-500 text-xl" />,
  TASK_DUE_SOON: <FiAlertTriangle className="text-amber-500 text-xl" />,
  TASK_CREATED: <FiCheckSquare className="text-blue-500 text-xl" />,
  TASK_UPDATED: <FiCheckSquare className="text-gray-500 text-xl" />,
  TASK_STATUS_CHANGED: <FiCheckSquare className="text-indigo-500 text-xl" />,
  TASK_DELETED: <FiCheckSquare className="text-red-500 text-xl" />,
};

const NotificationsPage = () => {
  const { data, isLoading, isError } = useGetNotificationsQuery(undefined, { pollingInterval: 60000 });
  const [markAsRead, { isLoading: isMarking }] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/30 border-t-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading notifications…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
        <FiBell className="text-5xl text-muted-foreground/30" />
        <p className="font-semibold text-foreground">Unable to load notifications. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FiBell /> Notifications
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="text-sm font-semibold text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-md transition-colors"
          >
            {isMarkingAll ? 'Marking...' : 'Mark all as read'}
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <FiBell className="text-5xl mb-4 opacity-20" />
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`p-5 flex items-start gap-4 transition-colors ${notification.isRead ? 'bg-card' : 'bg-primary/5'}`}
              >
                <div className="shrink-0 mt-1 bg-background p-2 rounded-full border border-border shadow-sm">
                  {notificationIcons[notification.type] || <FiBell className="text-muted-foreground text-xl" />}
                </div>
                
                <div className="flex-1">
                  <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {new Date(notification.createdAt).toLocaleString(undefined, { 
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                    })}
                  </p>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    disabled={isMarking}
                    className="shrink-0 text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-primary/10 transition-colors"
                    title="Mark as read"
                  >
                    <FiCheck className="text-lg" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
