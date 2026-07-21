import { Injectable, signal } from "@angular/core";
import { SignalrChannel } from "../common/signalr-service";
import { environment } from "../../../../environments/environment.development";

@Injectable({
    providedIn:'root'
})
export class ChatChannel extends SignalrChannel {
    public messages = signal<Message[]>([])
    
    constructor(){
        super(`${environment.hubApiUrl}/chat?Fluxify-Api-Key=` + 'bVNONIPtXjY9U2S_1w7yTmzG02Yui5w4wfH1v5dFQletj3vFms9gdPJEy3USx8pO');

        this.startConnection();
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