import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner';
import { UserService } from '../../../../core/services/rest/user-service';
import { UserDto } from '../../../../core/models/entity/user-dto';
import { DataList } from '../../../../core/models/common/data-list';
import { ChatService } from '../../../../core/services/rest/chat-service';
import { CoreComponent } from '../../../../core/components/core-component';

@Component({
  selector: 'app-chat-rooms',
  standalone: true,
  imports: [
    RouterModule,
    SpinnerComponent
  ],
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.css',
})
export class ChatRooms extends CoreComponent implements OnInit {

  protected chatService = inject(ChatService)

  allRooms = signal<ChatRoom[]>([])

  ngOnInit(): void {
    this.getRooms()
  }


  getRooms() {
    this.isLoading.set(true)
    this.chatService.getList().subscribe(res => {
      const rooms = res.data.items.map(m => ({
        id: m.id,
        title: m.title
      }));

      this.allRooms.set(rooms)

      this.isLoading.set(false)
    })
  }
}
