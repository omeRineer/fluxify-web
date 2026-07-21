import { Injectable, signal } from "@angular/core";
import { SignalrChannel } from "../common/signalr-service";
import { environment } from "../../../../environments/environment.development";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class PresenceSChannel extends SignalrChannel {

    public userStates = signal<UserState[]>([])

    constructor() {
        super(`${environment.hubApiUrl}/presence?Fluxify-Api-Key=` + 'bVNONIPtXjY9U2S_1w7yTmzG02Yui5w4wfH1v5dFQletj3vFms9gdPJEy3USx8pO')

        this.startConnection();
    }

    protected override registerEvents(): void {
        this.hubConnection.on("ReceiveOnlineUsers", (userStates: UserState[]) => {
            this.userStates.update(val=> userStates)
        })
    }

    getOnlineUsers():Observable<void>{
        return this.invokeHubMethod("GetOnlineUsers")
    }

}