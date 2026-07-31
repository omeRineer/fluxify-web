import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http.service";
import { Observable } from "rxjs";
import { ApiDataResponse, ApiResponse } from "../../models/common/api.models";
import { DataList } from "../../models/common/data.models";
import { MessageDto } from "../../models/rest/message.models";
import { ChatDto } from "../../models/rest/chat.models";

@Injectable({
    providedIn: "root"
})
export class ChatService extends BaseHttpService {
    constructor() {
        super("chat")
    }

    getHistory(chatId: string): Observable<ApiDataResponse<DataList<MessageDto.List>>> {
        return this.get<ApiDataResponse<DataList<MessageDto.List>>>(`/${chatId}/history`)
    }

    create(title: string, users: string[]): Observable<ApiDataResponse<string>> {
        return this.post<ApiDataResponse<string>>(``, {
            title: title,
            userIds: users
        })
    }

    getRooms(): Observable<ApiDataResponse<DataList<ChatDto.List>>> {
        return this.get<ApiDataResponse<DataList<ChatDto.List>>>(`/rooms`)
    }

    sendMessage(text: string, chatId: string): Observable<ApiResponse> {
        return this.post<ApiResponse>(`/${chatId}/message`, { text: text })
    }
}