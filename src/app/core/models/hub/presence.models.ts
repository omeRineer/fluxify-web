export interface NotificationPayload {
    id:string;
    date:Date;
    level:string;
    title:string;
    summary:string;
    url?:string;
    thumbnail?:string;
}

export interface UserStatePayload {
    userId:string;
    status:string;
    date:Date;
    title:string;
}