import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatRooms } from './components/chat-rooms/chat-rooms';
import { RouterModule } from '@angular/router';
import { ChatHubService } from '../../core/services/hubs/chat-hub.service';
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
  chatHubService = inject(ChatHubService)

  ngOnDestroy(): void {
    this.chatHubService.disconnect()
  }

  ngOnInit(): void {
    this.chatHubService.connect()
  }
  
}
