import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { map, Observable, take, tap } from 'rxjs';

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
import { UserContextService } from '../common/userContext.service';
import { PageDataList } from '../../models/common/data.models';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
    private readonly presenceHub = inject(PresenceHubService)
    private readonly userContextService = inject(UserContextService)
    private readonly notificationService = inject(NotificationService)
    private readonly notificationStore = inject(NotificationStore)

    readonly currentPage = signal<number>(0);
    readonly hasMore = signal<boolean>(true);

    constructor() {
        effect(() => {
            const notifications = this.notificationStore.entities();
            const unreadCount = notifications.filter(n => !n.read).length;

            if (unreadCount < 10 && this.hasMore()) {
                this.fetchNextBatch();
            }
        });
    }

    initialize(): Observable<void> {
        this.presenceHub.connect();

        return this.notificationService.getList({ page: 0, size: 10, isRead: false, lastDate: this.userContextService.user$().Date?.toISOString() }).pipe(
            tap(res => {

                const notifications = res.data.data.map(notification => ({
                    id: notification.id,
                    sender: notification.sender,
                    type: notification.type,
                    title: notification.title,
                    summary: notification.summary,
                    date: notification.createDate,
                    timestamp: notification.createDate,
                    properties: notification.properties,
                    thumbnail: notification.thumbnail,
                    read: notification.isRead
                }));
                this.notificationStore.load(notifications)
                this.notificationStore.setUnreadCount(res.data.totalCount)

            }),

            map(() => void 0)
        )
    }

    getPagedList(page: number, size: number, isRead: boolean): Observable<ApiDataResponse<PageDataList<NotificationDto.List>>> {
        return this.notificationService.getList({ page, size, isRead, lastDate: this.userContextService.user$().Date?.toISOString() }).pipe(
            tap(res => {

                const notifications = res.data.data.map(notification => ({
                    id: notification.id,
                    sender: notification.sender,
                    date: notification.createDate,
                    type: notification.type,
                    title: notification.title,
                    summary: notification.summary,
                    timestamp: notification.createDate,
                    properties: notification.properties,
                    thumbnail: notification.thumbnail,
                    read: notification.isRead
                }));
                this.notificationStore.addRange(notifications)

            })
        )
    }

    private fetchNextBatch(): void {
        const nextPage = this.currentPage() + 1;

        this.getPagedList(nextPage, 10, false)
            .pipe(take(1)) // Bellek sızıntısını önlemek için tek seferde kapanmasını sağla
            .subscribe({
                next: (response) => {
                    this.currentPage.set(nextPage);

                    if (!response || response.data.data.length === 0) {
                        this.hasMore.set(false);
                    }
                },
                error: (err) => {
                    console.error('Bildirimler yüklenirken hata oluştu:', err);
                }
            });
    }

    get(id: string): Observable<ApiDataResponse<NotificationDto.Detail>> {
        return this.notificationService.getDetail(id);
    }

    markAsRead(id: string): void {

        const notification = this.notificationStore.find(id);

        if (!notification || notification.read) {
            return;
        }

        this.notificationService.markAsRead(id).subscribe(res => {
            if (res.success) {
                this.notificationStore.update({
                    ...notification,
                    read: true
                });
                this.notificationStore.decrementUnreadCount();
            }
        })


    }

    dismiss(id: string): void {

        this.notificationStore.remove(id);

    }
}