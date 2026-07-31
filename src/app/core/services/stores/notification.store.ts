import { computed, Injectable, signal } from "@angular/core";
import { AppNotification } from "../../models/store/notification.models";



@Injectable({ providedIn: 'root' })
export class NotificationStore {
    private readonly notifications = signal<AppNotification[]>([])
    notifications$ = this.notifications.asReadonly();

    readonly unreadCount = computed(() => this.notifications().filter(n => !n.read).length);

    load(notifications:AppNotification[]){
        this.notifications.set(notifications)
    }

    set(notification: AppNotification) {
        this.notifications.update(val => [
            ...val,
            {
                ...notification
            }
        ])
    }

    markAsRead(id: string): void {
        this.notifications.update(list =>
            list.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    }

    markAsUnread(id: string): void {
        this.notifications.update(list =>
            list.map(n => (n.id === id ? { ...n, read: false } : n))
        );
    }

    markAllAsRead(): void {
        this.notifications.update(list => list.map(n => ({ ...n, read: true })));
    }

    dismiss(id: string): void {
        this.notifications.update(list => list.filter(n => n.id !== id));
    }
}