import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { ChatService } from '../rest/chat.service';
import { ChatHubService } from '../hubs/chat-hub.service';
import { ChatStore } from '../stores/chat.store';
import { MessageStore } from '../stores/message.store';
import { ToastService } from '../common/toast.service';

import { AppChat } from '../../models/store/chat.models';

@Injectable({ providedIn: 'root' })
export class ChatFacade {

    private readonly chatService = inject(ChatService);
    private readonly chatHub = inject(ChatHubService);
    private readonly chatStore = inject(ChatStore);
    private readonly messageStore = inject(MessageStore);
    private readonly toastService = inject(ToastService);

    initialize(): Observable<void> {

        this.chatHub.connect();

        return this.chatService.getRooms().pipe(

            tap(res => {

                const rooms = res.data.items.map(m =>
                    Object.assign(new AppChat(), {
                        id: m.id,
                        title: m.title,
                        createDate: new Date(m.createDate),
                        type: m.type
                    })
                );

                this.chatStore.load(rooms);

            }),

            map(() => void 0)
        );
    }

    getHistory(roomId: string): Observable<void> {

        return this.chatService.getHistory(roomId).pipe(

            tap(res => {

                const messages = res.data.items.map(m => ({
                    id: '',
                    chatId: m.chatId,
                    userId: m.userId,
                    text: m.text,
                    date: new Date(m.date),
                    name: m.name
                }));

                this.messageStore.load(messages);

            }),

            map(() => void 0)
        );
    }

    create(title: string, userIds: string[]): Observable<void> {

        const loadingToast = this.toastService.fire({
            level: 'loading',
            message: 'Yeni sohbet grubu oluşturuluyor'
        });

        return this.chatService.create(title, userIds).pipe(

            tap(res => {

                loadingToast.close();

                if (res.success) {
                    this.toastService.success(`${title} grubu başarıyla oluşturuldu.`);
                } else {
                    this.toastService.error(res.message, 'Hata');
                }

            }),

            map(() => void 0)
        );
    }

    sendTypingStatus(roomId: string, isTyping: boolean): Observable<void> {

        return this.chatHub.onTyping(roomId, isTyping);

    }

    sendMessage(roomId: string, text: string): Observable<void> {

        return this.chatService.sendMessage(text, roomId).pipe(

            tap(res => {

                if (res.success) {
                    this.chatHub.onTyping(roomId, false).subscribe();
                } else {
                    this.toastService.error(res.message, 'Hata');
                }

            }),

            map(() => void 0)
        );
    }
}