import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/components/spinner.component';
import { UserService } from '../../../../core/services/rest/user.service';
import { UserDto } from '../../../../core/models/entity/user.models';
import { DataList } from '../../../../core/models/common/data.models';
import { ChatService } from '../../../../core/services/rest/chat.service';
import { CoreComponent } from '../../../../core/components/core.component';
import { Stores } from '../../../../core/services/common/stores';
import { CreateChatModalComponent } from '../../../../shared/modals/createChatModal.component';
import { Dialog } from '@angular/cdk/dialog';
import { DialogService } from '../../../../core/services/common/dialog.service';
import { ToastService } from '../../../../core/services/common/toast.service';
import { SmartDatePipe } from '../../../../core/pipes/smart-date.pipe';
import { MeService } from '../../../../core/services/rest/me.service';
import { ChatDto } from '../../../../core/models/entity/chat.models';

@Component({
  selector: 'app-chat-rooms',
  standalone: true,
  imports: [
    RouterModule,
    SpinnerComponent,
    SmartDatePipe
  ],
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.css',
})
export class ChatRooms extends CoreComponent implements OnInit {

  protected chatService = inject(ChatService)
  protected router = inject(Router)
  private dialogService = inject(DialogService);
  private toastService = inject(ToastService)
  selectedRoom = inject(Stores).selectedRoom;

  allRooms = signal<ChatDto.List[]>([])


  ngOnInit(): void {
    this.getRooms()
  }

  selectRoom(room: ChatDto.List) {
    this.selectedRoom.set(room)
  }

  getRooms() {
    this.isLoading.set(true)
    this.chatService.getRooms().subscribe(res => {
      const rooms = res.data.items.map(m => ({
        id: m.id,
        title: m.title,
        createDate: m.createDate,
        type: m.type
      }));

      this.allRooms.set(rooms)

      this.isLoading.set(false)
    })
  }

  createChat() {
    this.dialogService.openAndGetResult<CreateChatModalComponent, any, { title: string, userIds: string[] }>(CreateChatModalComponent, {
      width: '480px'
    }).subscribe(result => {
      
      if (result?.action === 'confirm' && result.data) {
        const loadingToast = this.toastService.fire({
          level: 'loading',
          message: 'Yeni sohbet grubu oluşturuluyor'
        })

        this.chatService.create(result.data.title, result.data.userIds).subscribe(res => {
          loadingToast.close();
          if (res.success){
            this.toastService.success(`${result.data?.title} grubu başarıyla oluşturuldu.`);
            this.getRooms();
          }
          else {
            this.toastService.error(res.message, 'Hata')
          }
        })
      }
    });


  }
}
