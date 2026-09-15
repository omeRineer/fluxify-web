// export type NotificationLevel = 'message' | 'system' | 'alert' | 'success';

export type AppNotificationStatus = 'all' | 'unread';

export interface AppNotification {
  id: string;
  sender: string | null;
  date: Date;
  type: string;
  title: string;
  summary: string;
  timestamp: Date;
  thumbnail?:string;
  properties?: Record<string, any>;
  read: boolean;
}