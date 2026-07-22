import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner';
import { UserService } from '../../../../core/services/rest/user-service';
import { UserDto } from '../../../../core/models/entity/user-dto';
import { DataList } from '../../../../core/models/common/data-list';
import { ChatService } from '../../../../core/services/rest/chat-service';
import { CoreComponent } from '../../../../core/components/core-component';
import { Stores } from '../../../../core/services/common/stores';

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
  protected router = inject(Router)
  selectedRoom = inject(Stores).selectedRoom;

  allRooms = signal<ChatRoom[]>([])

  ngOnInit(): void {
    this.getRooms()
  }

  selectRoom(room: ChatRoom) {
    this.selectedRoom.set(room)
  }

  getRooms() {
    this.isLoading.set(true)
    console.log(this.isLoading())
    this.chatService.getList().subscribe(res => {
      const rooms = res.data.items.map(m => ({
        id: m.id,
        title: m.title
      }));

      this.allRooms.set(rooms)

      this.isLoading.set(false)
      console.log(this.isLoading())
    })
  }
}
