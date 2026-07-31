import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';
import { UserService } from '../../../../core/services/rest/user.service';
import { UserDto } from '../../../../core/models/rest/user.models';
import { DataList } from '../../../../core/models/common/data.models';
import { ChatService } from '../../../../core/services/rest/chat.service';
import { CoreComponent } from '../../../../core/components/core.component';
import { CreateChatModalComponent } from '../../../../shared/modals/createChatModal.component';
import { Dialog } from '@angular/cdk/dialog';
import { DialogService } from '../../../../core/services/common/dialog.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import { SmartDatePipe } from '../../../../core/pipes/smart-date.pipe';
import { MeService } from '../../../../core/services/rest/me.service';
import { ChatDto } from '../../../../core/models/rest/chat.models';
import { AppChat } from '../../../../core/models/store/chat.models';
import { ChatStore } from '../../../../core/services/stores/chat.store';
import { TimeAgoPipe } from '../../../../core/pipes/time-ago.pipe';
import { ChatFacade } from '../../../../core/services/facades/chat-facade.service';


const AVATAR_PALETTE = ['#4f7fff', '#8b5cf6', '#35d69b', '#f5a623', '#f2596b'];
@Component({
  selector: 'app-chat-rooms',
  standalone: true,
  imports: [
    RouterModule,
    SpinnerComponent,
    TimeAgoPipe
  ],
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.scss',
})
export class ChatRooms extends CoreComponent implements OnInit {

  protected chatFacade = inject(ChatFacade)
  protected chatStore = inject(ChatStore)
  selectedRoom = signal<AppChat | null>(null);
  rooms = this.chatStore.entities();

  ngOnInit(): void {
    this.isLoading.set(true)
    this.chatFacade.initialize().subscribe(() => {
      this.isLoading.set(false)
    });
  }

  selectRoom(room: AppChat) {
    this.selectedRoom.set(room)
    this.router.navigate(['chat', room.id])
  }

  createChat() {
    this.dialogService.openAndGetResult<CreateChatModalComponent, any, { title: string, userIds: string[] }>(CreateChatModalComponent, {
      width: '480px'
    }).subscribe(result => {

      this.isLoading.set(true)
      if (result?.action === 'confirm' && result.data) {
        this.chatFacade.create(result.data.title, result.data.userIds).subscribe(() => {
          this.isLoading.set(false)
        });
      }

    });
  }

  avatarColor(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  }
}
