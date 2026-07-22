import { inject, Injectable, signal } from "@angular/core";
import { SignalrChannel } from "../common/signalr-service";
import { environment } from "../../../../environments/environment.development";
import { UserContext } from "../common/user-context";

@Injectable({
    providedIn:'root'
})
export class ChatChannel extends SignalrChannel {
    public messages = signal<Message[]>([])
    
    constructor(){
        const apiKey = inject(UserContext).state$().ApiKey;
        
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
    }


}