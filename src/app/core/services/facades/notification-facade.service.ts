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
import { NotificationDto, NotificationQuery } from '../../models/rest/notification.models';
import { ApiDataResponse } from '../../models/common/api.models';
import { UserContextService } from '../common/userContext.service';
import { PageDataList } from '../../models/common/data.models';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
    private readonly presenceHub = inject(PresenceHubService)
    private readonly userContextService = inject(UserContextService)
    private readonly notificationService = inject(NotificationService)
    private readonly notificationStore = inject(NotificationStore)

    constructor() {
    }

    initialize(): Observable<void> {
        this.presenceHub.connect();

        return this.getList({ page: 0, size: 10, isRead: false, lastDate: this.userContextService.user$().Date?.toISOString() }).pipe(
            tap(res => {
                this.notificationStore.setUnreadCount(res.data.totalCount)
            }),

            map(() => void 0)
        )
    }

    getList(query: NotificationQuery): Observable<ApiDataResponse<PageDataList<NotificationDto.List>>> {
        return this.notificationService.getList(query);
    }

    get(id: string): Observable<ApiDataResponse<NotificationDto.Detail>> {
        return this.notificationService.getDetail(id);
    }

    markAsRead(id: string): void {

        this.notificationService.markAsRead(id).subscribe(res => {
            if (res.success) {
                this.notificationStore.reads.update(prev => [...prev, id]);
                this.notificationStore.decrementUnreadCount();
            }
        })


    }

    dismiss(id: string): void {

        this.notificationStore.remove(id);

    }
}