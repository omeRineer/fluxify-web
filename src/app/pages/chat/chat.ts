import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ChatRooms } from './components/chat-rooms/chat-rooms';
import { RouterModule } from '@angular/router';
import { ChatHubService } from '../../core/services/hubs/chat-hub.service';
import { DatePipe } from '@angular/common';
import { SpinnerComponent } from '../../shared/components/spinner.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatRooms,
    RouterModule,
    SpinnerComponent
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat  {
  
}
