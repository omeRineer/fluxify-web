import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse, ApiResponse } from "../../models/common/api.models";
import { DataList } from "../../models/common/data.models";
import { MessageDto } from "../../models/rest/message.models";
import { ChatDto } from "../../models/rest/chat.models";
import { NotificationDto } from "../../models/rest/notification.models";

@Injectable({
    providedIn: "root"
})
export class MeService extends BaseHttpService {
    constructor() {
        super("me")
    }

    

}