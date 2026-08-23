import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { ChatService } from '../rest/chat.service';
import { ChatHubService } from '../hubs/chat-hub.service';
import { ChatStore } from '../stores/chat.store';
import { MessageStore } from '../stores/message.store';
import { ToastService } from '../common/toast.service';

import { AppChat } from '../../models/store/chat.models';
import { NotificationStore } from '../stores/notification.store';
import { PresenceHubService } from '../hubs/presence-hub.service';
import { MeService } from '../rest/me.service';
import { NotificationService } from '../rest/notification.service';
import { AppNotification } from '../../models/store/notification.models';
import { NotificationDto } from '../../models/rest/notification.models';
import { ApiDataResponse } from '../../models/common/api.models';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
    private readonly presenceHub = inject(PresenceHubService)
    private readonly notificationService = inject(NotificationService)
    private readonly notificationStore = inject(NotificationStore)

    initialize(): Observable<void> {
        this.presenceHub.connect();

        return this.notificationService.getList().pipe(
            tap(res => {

                const notifications = res.data.items.map(notification => ({
                    id: notification.id,
                    sender: notification.sender,
                    level: notification.level,
                    title: notification.title,
                    summary: notification.summary,
                    timestamp: notification.createDate,
                    url: notification.url,
                    thumbnail: notification.thumbnail,
                    read: notification.isRead
                }));
                this.notificationStore.load(notifications)

            }),

            map(() => void 0)
        )
    }

    get(id: string): Observable<ApiDataResponse<NotificationDto.Detail>> {
        return this.notificationService.getDetail(id);
    }

    markAsRead(id: string): void {

        const notification = this.notificationStore.find(id);

        if (!notification || notification.read) {
            return;
        }

        this.notificationStore.update({
            ...notification,
            read: true
        });
    }

    markAsUnread(id: string): void {

        const notification = this.notificationStore.find(id);

        if (!notification || !notification.read) {
            return;
        }

        this.notificationStore.update({
            ...notification,
            read: false
        });
    }

    markAllAsRead(): void {

        const updated = this.notificationStore
            .entities()
            .map(x => ({
                ...x,
                read: true
            }));

        this.notificationStore.load(updated);
    }

    dismiss(id: string): void {

        this.notificationStore.remove(id);

    }
}