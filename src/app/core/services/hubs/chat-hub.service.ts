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
        this.hubConnection.on("ReceiveMessage", (message: Message) => {
            this.messages.update(prev => [
                ...prev,
                {
                    ...message
                }
            ])
        });

        this.hubConnection.on("OnTyping", (message: { chatId: string, isTyping: boolean }) => {
            this.onTypings.update(prev => {
                const existingIndex = prev.findIndex(f => f.chatId === message.chatId);

                if (existingIndex === -1) {
                    if (message.isTyping) {
                        return [...prev, { chatId: message.chatId, counter: 1 }];
                    }
                    return prev; 
                }

                const currentItem = prev[existingIndex];
                const newCounter = message.isTyping
                    ? currentItem.counter + 1
                    : Math.max(0, currentItem.counter - 1); 

                const updated = [...prev];
                updated[existingIndex] = {
                    ...currentItem,
                    counter: newCounter
                };

                return updated;
            });
        });
    }

    onTyping(chatId:string, isTyping:boolean):Observable<void>{
        return this.invokeHubMethod("OnTyping", chatId, isTyping)
    }

}