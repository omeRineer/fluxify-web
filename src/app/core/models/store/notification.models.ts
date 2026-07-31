// export type NotificationLevel = 'message' | 'system' | 'alert' | 'success';

export type AppNotificationStatus = 'all' | 'unread';

export interface AppNotification {
  id: string;
  level: string;
  title: string;
  summary: string;
  timestamp: Date;
  url?:string;
  thumbnail?:string;
  read: boolean;
}