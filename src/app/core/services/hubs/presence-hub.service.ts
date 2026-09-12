import { inject, Injectable, signal } from "@angular/core";
import { SignalrHubService } from "../common/signalr-hub.service";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import { UserContextService } from "../common/userContext.service";
import { NotificationPayload, UserStatePayload } from "../../models/hub/presence.models";
import { ToastService } from "../common/toast.service";
import { NotificationStore } from "../stores/notification.store";
import { UserStore } from "../stores/users.store";


@Injectable({
    providedIn: 'root'
})
export class PresenceHubService extends SignalrHubService {
    notificationStore = inject(NotificationStore)
    userStore = inject(UserStore)


    constructor() {
        const token = inject(UserContextService).user$().Token;
        super(`${environment.hubApiUrl}/presence?access_token=${token}&Flx-Device-Id=DVC_XYZ&Flx-Device-Platform=web&Flx-Device-Token=qewtwe`);
        this.userContext.onSet$.subscribe(this.connect)
    }

    protected override registerEvents(): void {
        this.hubConnection.on("ReceiveUserState", (userState: UserStatePayload) => {
            this.userStore.add({
                id: userState.id,
                key: userState.key,
                status: userState.status,
                date: new Date(userState.date)
            })
        })

        this.hubConnection.on("ReceiveNotification", (notification: NotificationPayload) => {
            this.toastService.fire({
                title:notification.title,
                message: notification.summary,
                type: notification.type,
                playSound: true,
                thumbnail: notification.thumbnail,
                url: notification.url
            })
            this.notificationStore.add({
                id: notification.id,
                sender: null,
                type: notification.type,
                title: notification.title,
                summary: notification.summary,
                timestamp: new Date(notification.date),
                read: false
            })
            this.notificationStore.incrementUnreadCount();
           
        })
    }

    getOnlineUsers(): Observable<void> {
        return this.invokeHubMethod("GetOnlineUsers")
    }

}