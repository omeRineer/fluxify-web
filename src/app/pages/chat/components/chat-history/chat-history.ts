import { Component, computed, effect, inject, input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { ChatHubService } from '../../../../core/services/hubs/chat-hub.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatService } from '../../../../core/services/rest/chat.service';
import { SpinnerComponent } from "../../../../shared/components/spinner.component";
import { CoreComponent } from '../../../../core/components/core.component';
import { UserContextService } from '../../../../core/services/common/userContext.service';
import { Stores } from '../../../../core/services/common/stores';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [
    DatePipe,
    SpinnerComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.css',
})
export class ChatHistory extends CoreComponent implements OnDestroy, OnInit {
  protected chatHubService = inject(ChatHubService);
  protected chatService = inject(ChatService)
  protected usercontext = inject(UserContextService);

  messageText = signal<string>('');
  private isTyping = false;

  roomId = input<string>("")
  prevRoomId: string | null = null;
  selectedRoom = inject(Stores).selectedRoom;
  messages = this.chatHubService.messages;
  chatMessages = computed(() => {
    const activeRoomId = this.roomId();
    if (!activeRoomId) return [];

    return this.messages().filter(msg =>
      msg.chatId === activeRoomId
    );
  })
  typingCounter = computed(() => {
    const activeRoomId = this.roomId();

    const existingIndex = this.chatHubService.onTypings().findIndex(item => activeRoomId in item);

    if (existingIndex === -1)
      return 0;

    return this.chatHubService.onTypings()[existingIndex][activeRoomId]
  })

  constructor() {

    super()
    effect(() => {
      this.sendTypingStatus(this.prevRoomId ?? this.roomId(), false);
      this.prevRoomId = this.roomId();
      this.messageText.set('')
      const id = this.roomId();
      if (id) {
        this.getHistory(id);
      }
    })
  }
  ngOnInit(): void {
    this.prevRoomId = this.roomId();
  }

  ngOnDestroy(): void {
    this.sendTypingStatus(this.roomId(), false);
  }

  getHistory(id: string) {
    this.isLoading.set(true)
    this.chatService.getHistory(id).subscribe(res => {
      const messagesData = res.data.items.map(m => ({
        chatId: m.chatId,
        userId: m.userId,
        text: m.text,
        date: m.date,
        name: m.name
      }))
      this.messages.set(messagesData)
      this.isLoading.set(false)
    })
  }

  sendMessage() {
    this.chatService.sendMessage(this.messageText(), this.roomId()).subscribe(res => {
      this.messageText.set('')
      this.sendTypingStatus(this.roomId(), false)
    })
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.trim();

    // 1. İnput içinde değer var mı?
    if (value.length > 0) {
      if (!this.isTyping) {
        this.isTyping = true;
        this.sendTypingStatus(this.roomId(), true);
      }

    } else {
      if (this.isTyping) {
        this.isTyping = false;
        this.sendTypingStatus(this.roomId(), false);
      }
    }
  }

  private sendTypingStatus(roomId: string, isTyping: boolean): void {
    this.chatHubService.onTyping(roomId, isTyping).subscribe()
  }
}
