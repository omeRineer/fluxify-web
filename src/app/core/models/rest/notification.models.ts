export namespace NotificationDto{
    export interface List{
        id:string;
        sender:string;
        level:string;
        contentType:string;
        title:string;
        summary:string;
        thumbnail?:string;
        url?:string;
        createDate:Date;
        isRead:boolean;
    }

    export interface Detail{
        id:string;
        sender:string;
        level:string;
        contentType:string;
        title:string;
        summary:string;
        thumbnail?:string;
        url?:string;
        createDate:Date;
        isRead:boolean;
    }
}