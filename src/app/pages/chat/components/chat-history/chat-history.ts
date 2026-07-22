import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ChatChannel } from '../../../../core/services/hubs/chat-channel';
import { CommonModule, DatePipe } from '@angular/common';
import { ChatService } from '../../../../core/services/rest/chat-service';
import { SpinnerComponent } from "../../../../shared/components/spinner";
import { CoreComponent } from '../../../../core/components/core-component';
import { UserContext } from '../../../../core/services/common/user-context';
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
  protected chatHub = inject(ChatChannel);
  protected chatService = inject(ChatService)
  protected usercontext = inject(UserContext);

  messageText = signal<string>('');

  roomId = input<string>("")
  selectedRoom = inject(Stores).selectedRoom;
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
    this.isLoading.set(true)
    this.chatService.getHistory(id).subscribe(res => {
      const messagesData = res.data.items.map(m => ({
        chatId: m.chatId,
        userId: m.userId,
        text: m.text,
        date: m.date
      }))
      this.messages.set(messagesData)
      this.isLoading.set(false)
    })
  }

  sendMessage(){
    this.chatService.sendMessage(this.messageText(), this.roomId()).subscribe(res=> {
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
}
