import { Component, computed, effect, inject, input } from '@angular/core';
import { ChatChannel } from '../../../../core/services/hubs/chat-channel';
import { DatePipe } from '@angular/common';
import { ChatService } from '../../../../core/services/rest/chat-service';
import { SpinnerComponent } from "../../../../shared/components/spinner";
import { CoreComponent } from '../../../../core/components/core-component';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [
    DatePipe,
    SpinnerComponent
  ],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.css',
})
export class ChatHistory extends CoreComponent {
  protected chatHub = inject(ChatChannel);
  protected chatService = inject(ChatService)

  roomId = input<string>()
  messages = this.chatHub.messages;
  chatMessages = computed(()=>{
    const activeRoomId = this.roomId();
    if (!activeRoomId) return [];

    return this.messages().filter(msg => 
      msg.chatId === activeRoomId
    );
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
    this.chatService.getHistory(id).subscribe(res => {
      const messagesData = res.data.items.map(m => ({
        chatId: m.chatId,
        userId: m.userId,
        text: m.text,
        date: m.date
      }))
      this.messages.set(messagesData)
    })
  }
}
