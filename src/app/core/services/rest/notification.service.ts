import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse, ApiResponse } from "../../models/common/api.models";
import { DataList, PageDataList } from "../../models/common/data.models";
import { NotificationDto, NotificationQuery } from "../../models/dto/notification.models";
import { HttpParams } from "@angular/common/http";


@Injectable({ providedIn: "root" })
export class NotificationService extends BaseHttpService {
    constructor() {
        super("notifications")
    }

    getList(query: NotificationQuery): Observable<ApiDataResponse<PageDataList<NotificationDto.List>>> {
        let params = new HttpParams()
            .set('page', query.page)
            .set('size', query.size)
            .set('lastDate', query.lastDate || '')

        if (query.search) {
            params = params.set('search', query.search);
        }

        if (query.isRead !== undefined) {
            params = params.set('isRead', query.isRead.toString());
        }

        return this.get<ApiDataResponse<PageDataList<NotificationDto.List>>>('', { params });
    }

    getDetail(id: string): Observable<ApiDataResponse<NotificationDto.Detail>> {
        return this.get<ApiDataResponse<NotificationDto.Detail>>(`/${id}`)
    }

    markAsRead(notification: string): Observable<ApiResponse> {
        return this.post<ApiResponse>("/mark-as-read", JSON.stringify(notification))
    }
}