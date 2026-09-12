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
        url?:string;
        createDate:Date;
        isRead:boolean;
    }

    export interface Detail{
        id:string;
        sender:string;
        type:string;
        contentType:string;
        title:string;
        summary:string;
        thumbnail?:string;
        url?:string;
        createDate:Date;
        isRead:boolean;
    }
}

export interface NotificationQuery extends QueryOptions{
    isRead:boolean;
    lastDate?:string;
}