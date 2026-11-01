import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse, ApiResponse } from "../../models/common/api.models";
import { DataList } from "../../models/common/data.models";
import { MessageDto } from "../../models/dto/message.models";
import { ChatDto } from "../../models/dto/chat.models";
import { NotificationDto } from "../../models/dto/notification.models";
import { UserDto } from "../../models/dto/user.models";
import { UpdateProfileRequest } from "../../models/api/me.models";

@Injectable({
    providedIn: "root"
})
export class MeService extends BaseHttpService {
    constructor() {
        super("me")
    }

    getProfile(): Observable<ApiDataResponse<UserDto.Profile>> {
        return this.get<ApiDataResponse<UserDto.Profile>>("")
    }

    save(req: UpdateProfileRequest) {
        return this.post<ApiDataResponse<UserDto.Profile>>("/save", req)
    }

}