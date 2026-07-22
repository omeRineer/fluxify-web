import { Injectable } from "@angular/core";
import { BaseHttpService } from "../common/http-service";
import { Observable } from "rxjs";
import { ApiDataResponse, ApiResponse } from "../../models/common/api-response";
import { DataList } from "../../models/common/data-list";
import { MessageDto } from "../../models/entity/message-dto";
import { ChatDto } from "../../models/entity/chat-dto";

@Injectable({
    providedIn: "root"
})
export class ChatService extends BaseHttpService {
    constructor() {
        super("Chat")
    }

    getList(): Observable<ApiDataResponse<DataList<ChatDto.List>>> {
        return this.get<ApiDataResponse<DataList<ChatDto.List>>>(``)
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

    sendMessage(text: string, chatId: string): Observable<ApiResponse> {
        return this.post<ApiResponse>(`/${chatId}/message`, { text: text })
    }
}