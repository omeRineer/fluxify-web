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
    id:string;
    key:string;
    status:string;
    date:Date;
}