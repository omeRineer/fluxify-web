import { Component, computed, effect, inject, input, signal } from '@angular/core';
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
export class ChatHistory extends CoreComponent {
  protected chatHubService = inject(ChatHubService);
  protected chatService = inject(ChatService)
  protected usercontext = inject(UserContextService);

  messageText = signal<string>('');
  private typingTimeout: any;
  private isTyping = false;

  roomId = input<string>("")
  selectedRoom = inject(Stores).selectedRoom;
  messages = this.chatHubService.messages;
  chatMessages = computed(() => {
    const activeRoomId = this.roomId();
    if (!activeRoomId) return [];

    return this.messages().filter(msg =>
      msg.chatId === activeRoomId
    );
  })
  chatTypings = computed(()=>{
    const activeRoomId = this.roomId();

    const existingIndex = this.chatHubService.onTypings().findIndex(f=> f.chatId === activeRoomId);

    return this.chatHubService.onTypings()[existingIndex]
  })

  constructor() {
    super()
    effect(() => {
      const id = this.roomId();
      console.log(id)
      if (id) {
        this.getHistory(id);
      }
    })
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
      console.log(res)
      this.messageText.set('')
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
        this.sendTypingStatus(true);
      }

      // Her tuşa basıldığında önceki sayacı sıfırla (2 sn sonra durdu kabul edeceğiz)
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.isTyping = false;
        this.sendTypingStatus(false);
      }, 2000);

    } else {
      // 2. İnput boşaltıldıysa sayacı temizle ve anında false gönder
      clearTimeout(this.typingTimeout);
      if (this.isTyping) {
        this.isTyping = false;
        this.sendTypingStatus(false);
      }
    }
  }

  private sendTypingStatus(isTyping: boolean): void {
    this.chatHubService.onTyping(this.roomId(), isTyping).subscribe()
  }
}
