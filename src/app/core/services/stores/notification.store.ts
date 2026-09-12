import { computed, Injectable, signal } from "@angular/core";
import { AppNotification } from "../../models/store/notification.models";
import { BaseStore } from "../common/store.service";



@Injectable({ providedIn: 'root' })
export class NotificationStore extends BaseStore<AppNotification> {
    readonly unreadCount = signal<number>(0);

    setUnreadCount(count: number): void {
        this.unreadCount.set(count);
    }

    incrementUnreadCount(): void {
        this.unreadCount.update(count => count + 1);
    }

    decrementUnreadCount(): void {
        this.unreadCount.update(count => Math.max(0, count - 1));
    }
}