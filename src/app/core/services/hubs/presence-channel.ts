import { inject, Injectable, signal } from "@angular/core";
import { SignalrChannel } from "../common/signalr-service";
import { environment } from "../../../../environments/environment.development";
import { Observable } from "rxjs";
import { UserContext } from "../common/user-context";


@Injectable({
    providedIn: 'root'
})
export class PresenceSChannel extends SignalrChannel {

    public userStates = signal<UserState[]>([])

    constructor() {
        const apiKey = inject(UserContext).state$().ApiKey;

        super(`${environment.hubApiUrl}/presence?Fluxify-Api-Key=${apiKey}`);
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