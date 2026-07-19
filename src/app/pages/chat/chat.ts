import { Component } from '@angular/core';
import { ChatRooms } from './components/chat-rooms/chat-rooms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  imports: [
    ChatRooms,
    RouterModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

}
