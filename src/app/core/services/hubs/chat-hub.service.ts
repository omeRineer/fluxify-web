import { inject, Injectable, signal } from "@angular/core";
import { SignalrHubService } from "../common/signalr-hub.service";
import { environment } from "../../../../environments/environment.development";
import { UserContextService } from "../common/userContext.service";
import { MessagePayload, TypingCounterPayload } from "../../models/hub/chat.models";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ChatHubService extends SignalrHubService {
    public messages = signal<MessagePayload[]>([])
    public onTypings = signal<TypingCounterPayload[]>([])

    constructor() {
        const apiKey = inject(UserContextService).user$().ApiKey;

        super(`${environment.hubApiUrl}/chat?Fluxify-Api-Key=${apiKey}`);

    }

    override registerEvents(): void {
        this.hubConnection.on("ReceiveMessage", (message: MessagePayload) => {
            this.messages.update(prev => [
                ...prev,
                {
                    ...message
                }
            ])
        });

        this.hubConnection.on("OnTyping", (message: { chatId: string; isTyping: boolean }) => {
            this.onTypings.update((prev: TypingCounterPayload[]) => {
                const existingIndex = prev.findIndex(item => message.chatId in item);

                if (existingIndex === -1) {
                    if (message.isTyping) {
                        return [...prev, { [message.chatId]: 1 }];
                    }
                    return prev;
                }

                const currentCounter = prev[existingIndex][message.chatId];
                const newCounter = message.isTyping
                    ? currentCounter + 1
                    : Math.max(0, currentCounter - 1);

                if (newCounter === 0) {
                    return prev.filter((_, idx) => idx !== existingIndex);
                }

                const updated = [...prev];
                updated[existingIndex] = { [message.chatId]: newCounter };

                return updated;
            });
        });
    }

    onTyping(chatId: string, isTyping: boolean): Observable<void> {
        return this.invokeHubMethod("OnTyping", chatId, isTyping)
    }

}