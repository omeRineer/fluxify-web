import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse } from "../../models/common/api.models";
import { DataList } from "../../models/common/data.models";
import { NotificationDto } from "../../models/rest/notification.models";


@Injectable({ providedIn: "root" })
export class NotificationService extends BaseHttpService {
    constructor() {
        super("notifications")
    }

    getList(): Observable<ApiDataResponse<DataList<NotificationDto.List>>> {
        return this.get<ApiDataResponse<DataList<NotificationDto.List>>>()
    }

    getDetail(id:string): Observable<ApiDataResponse<NotificationDto.Detail>> {
        return this.get<ApiDataResponse<NotificationDto.Detail>>(`/${id}`)
    }

}