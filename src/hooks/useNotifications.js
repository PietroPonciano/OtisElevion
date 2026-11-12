import { notifications } from '../data/static'
export const useNotifications = () => ({
  notifications,
  unreadCount: notifications.filter((item) => !item.read).length,
  refresh: () => undefined,
  markRead: () => undefined,
})
