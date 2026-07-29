import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse, ApiResponse } from "../../models/common/api.models";
import { DataList } from "../../models/common/data.models";
import { MessageDto } from "../../models/entity/message.models";
import { ChatDto } from "../../models/entity/chat.models";

@Injectable({
    providedIn: "root"
})
export class MeService extends BaseHttpService {
    constructor() {
        super("me")
    }

    

    getNotifications(): Observable<ApiDataResponse<DataList<ChatDto.List>>> {
        return this.get<ApiDataResponse<DataList<ChatDto.List>>>(`/notifications`)
    }
}