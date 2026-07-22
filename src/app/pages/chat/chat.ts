import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatRooms } from './components/chat-rooms/chat-rooms';
import { RouterModule } from '@angular/router';
import { ChatChannel } from '../../core/services/hubs/chat-channel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatRooms,
    RouterModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit, OnDestroy {
  chatHub = inject(ChatChannel)

  ngOnDestroy(): void {
    this.chatHub.disconnect()
  }

  ngOnInit(): void {
    this.chatHub.connect()
  }
  
}
