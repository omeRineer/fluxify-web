export interface NotificationPayload {
    id:string;
    date:Date;
    type:string;
    title:string;
    summary:string;
    properties?: Record<string, any>;
    thumbnail?:string;
}

export interface UserStatePayload {
    id:string;
    key:string;
    status:string;
    date:Date;
}