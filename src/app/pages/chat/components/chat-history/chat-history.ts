import {
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize, map } from 'rxjs';
import {
  takeUntilDestroyed,
  toSignal
} from '@angular/core/rxjs-interop';

import { CoreComponent } from '../../../../core/components/core.component';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';

import { ChatFacade } from '../../../../core/services/facades/chat-facade.service';
import { ChatStore } from '../../../../core/services/stores/chat.store';
import { MessageStore } from '../../../../core/services/stores/message.store';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [
    TimeAgoPipe,
    SpinnerComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory extends CoreComponent {

  readonly chatFacade = inject(ChatFacade);
  readonly chatStore = inject(ChatStore);
  readonly messageStore = inject(MessageStore);

  readonly menuOpen = signal(false);

  private isTyping = false;
  private prevRoomId: string | null = null;

  readonly messageText = signal('');

  readonly roomId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('roomId'))
    ),
    {
      initialValue: null
    }
  );

  readonly activeRoom = computed(() => {
    const roomId = this.roomId();

    if (!roomId) {
      return null;
    }

    return this.chatStore.find(roomId) ?? null;
  });

  readonly chatMessages = computed(() => {
    const roomId = this.roomId();

    if (!roomId) {
      return [];
    }

    return this.messageStore
      .entities()
      .filter(x => x.chatId === roomId);
  });

  constructor() {
    super();

    effect(() => {

      const room = this.activeRoom();

      if (!room) {
        return;
      }

      if (this.prevRoomId && this.prevRoomId !== room.id) {
        this.chatFacade
          .sendTypingStatus(this.prevRoomId, false)
          .subscribe();
      }

      this.prevRoomId = room.id;
      this.messageText.set('');

      this.isLoading.set(true);

      this.chatFacade
        .getHistory(room.id)
        .pipe(
          finalize(() => this.isLoading.set(false))
        )
        .subscribe();

    });
  }

  ngOnDestroy(): void {

    const room = this.activeRoom();

    if (!room) {
      return;
    }

    this.chatFacade
      .sendTypingStatus(room.id, false)
      .subscribe();
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  sendMessage(): void {

    const room = this.activeRoom();

    if (!room || !this.messageText().trim()) {
      return;
    }

    this.chatFacade
      .sendMessage(room.id, this.messageText())
      .subscribe(() => {
        this.messageText.set('');
      });
  }

  onKeyDown(event: KeyboardEvent): void {

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onInputChange(event: Event): void {

    const room = this.activeRoom();

    if (!room) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const hasValue = input.value.trim().length > 0;

    if (hasValue && !this.isTyping) {

      this.isTyping = true;

      this.chatFacade
        .sendTypingStatus(room.id, true)
        .subscribe();

    } else if (!hasValue && this.isTyping) {

      this.isTyping = false;

      this.chatFacade
        .sendTypingStatus(room.id, false)
        .subscribe();
    }
  }
}