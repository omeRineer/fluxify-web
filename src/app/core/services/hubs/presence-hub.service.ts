import { inject, Injectable, signal } from "@angular/core";
import { SignalrHubService } from "../common/signalr-hub.service";
import { environment } from "../../../../environments/environment.development";
import { Observable } from "rxjs";
import { UserContextService } from "../common/userContext.service";
import { NotificationPayload, UserStatePayload } from "../../models/hub/presence.models";
import { ToastService } from "../common/toast.service";


@Injectable({
    providedIn: 'root'
})
export class PresenceHubService extends SignalrHubService {
    public userStates = signal<UserStatePayload[]>([])
    public notifications = signal<NotificationPayload[]>([])


    constructor() {
        const token = inject(UserContextService).user$().Token;

        super(`${environment.hubApiUrl}/presence?access_token=${token}&Flx-Device-Id=DVC_XYZ&Flx-Device-Platform=web&Flx-Device-Token=qewtwe`);
    }

    protected override registerEvents(): void {
        this.hubConnection.on("ReceiveOnlineUsers", (userStates: UserStatePayload[]) => {
            this.userStates.update(val => userStates)
        })

        this.hubConnection.on("ReceiveNotification", (notification: NotificationPayload) => {
            this.toastService.fire({
                title:notification.title,
                message: notification.summary,
                level: notification.level,
                playSound: true,
                thumbnail: notification.thumbnail,
                url: notification.url
            })
            
            this.notifications.update(val => [
                ...val,
                {
                    ...notification
                }
            ])
        })
    }

    getOnlineUsers(): Observable<void> {
        return this.invokeHubMethod("GetOnlineUsers")
    }

}