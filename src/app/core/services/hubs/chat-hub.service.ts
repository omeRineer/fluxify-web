import { inject, Injectable, signal } from "@angular/core";
import { SignalrHubService } from "../common/signalr-hub.service";
import { environment } from "../../../../environments/environment.development";
import { UserContextService } from "../common/userContext.service";
import { MessagePayload } from "../../models/hub/chat.models";
import { Observable } from "rxjs";
import { ChatStore } from "../stores/chat.store";
import { MessageStore } from "../stores/message.store";

@Injectable({
    providedIn: 'root'
})
export class ChatHubService extends SignalrHubService {
    private readonly chatStore = inject(ChatStore);
    private readonly messageStore = inject(MessageStore);

    constructor() {
        const token = inject(UserContextService).user$().Token;

        super(`${environment.hubApiUrl}/chat?access_token=${token}&Flx-Device-Id=DVC_XYZ&Flx-Device-Platform=web`);

    }

    override registerEvents(): void {
        this.hubConnection.on("ReceiveMessage", (message: MessagePayload) => {
            this.messageStore.add({
                id:message.id,
                chatId: message.chatId,
                name: message.name,
                text: message.text,
                userId: message.userId,
                date: new Date(message.date)
            })
        });

        this.hubConnection.on("OnTyping", (message: { chatId: string; isTyping: boolean }) => {
            const targetChat = this.chatStore.find(message.chatId);

            if (targetChat) {
                targetChat.onTyping(message.isTyping);
            }
        });
    }

    onTyping(chatId: string, isTyping: boolean): Observable<void> {
        return this.invokeHubMethod("OnTyping", chatId, isTyping)
    }

}