import { computed, Injectable, signal } from "@angular/core";
import { AppNotification } from "../../models/store/notification.models";
import { BaseStore } from "../common/store.service";



@Injectable({ providedIn: 'root' })
export class NotificationStore extends BaseStore<AppNotification> {
    readonly unreadCount = computed(() => this.entities().filter(n => !n.read).length);

    
}