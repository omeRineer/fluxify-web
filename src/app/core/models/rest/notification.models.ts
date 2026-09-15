import { QueryOptions } from "../common/http.models";

export namespace NotificationDto{
    export interface List{
        id:string;
        sender:string;
        type:string;
        contentType:string;
        title:string;
        summary:string;
        thumbnail?:string;
        createDate:Date;
        properties?: Record<string, any>;
        isRead:boolean;
    }

    export interface Detail{
        id:string;
        sender:string;
        type:string;
        contentType:string;
        content:string;
        title:string;
        summary:string;
        thumbnail?:string;
        createDate:Date;
        properties?: Record<string, any>;
        isRead:boolean;
    }
}

export interface NotificationQuery extends QueryOptions{
    isRead:boolean;
    lastDate?:string;
}