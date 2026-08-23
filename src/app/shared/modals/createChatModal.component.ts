import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/rest/user.service';
import { UserDto } from '../../core/models/rest/user.models';
import { CoreModalComponent } from '../../core/components/core-modal.component';
import { SpinnerComponent } from "../components/spinner.component";
import { UserContextService } from '../../core/services/common/userContext.service';
import { ButtonComponent } from "../components/button.component";


@Component({
  selector: 'app-create-group-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent, ButtonComponent],
  template: `
    <div class="fx-modal-header">
      <h2 class="fx-modal-title">Yeni Sohbet</h2>
      <button type="button" class="fx-modal-close" (click)="close()" aria-label="Kapat">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>
 
    <div class="fx-modal-body">
      <div class="field">
        <label>Grup adı</label>
        <input type="text" placeholder="ör. Backend Ekibi" [value]="title()" (input)="title.set($any($event.target).value)" />
      </div>
 
      <div class="field">
        <label>Kullanıcılar</label>
        <input
          type="text"
          placeholder="Kullanıcı ID'lerini virgülle ayır"
          [value]="userIdsRaw()"
          (input)="userIdsRaw.set($any($event.target).value)"
        />
      </div>
    </div>
 
    <div class="fx-modal-footer">
      <app-button [variant]="'ghost'" [disabled]="isLoading()" (clicked)="cancel()">Vazgeç</app-button>
      <app-button [variant]="'primary'" [loading]="isLoading()" [disabled]="!title().trim() || isLoading()" (clicked)="onConfirm()">Oluştur</app-button>
    </div>
  `,
  styles: [`
    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }
    .field:last-of-type {
      margin-bottom: 0;
    }
    label {
      font-size: 12.5px;
      font-weight: 600;
      color: var(--fx-mist);
    }
    input {
      height: 38px;
      padding: 0 12px;
      border-radius: var(--fx-radius-md);
      background: var(--fx-elevated-2);
      border: 1px solid var(--fx-line-soft);
      color: var(--fx-ink);
      font-size: 13.5px;
      outline: none;
    }
    input::placeholder {
      color: var(--fx-fog);
    }
    input:focus {
      border-color: var(--fx-azure);
    }
  `]
})
export class CreateChatModalComponent extends CoreModalComponent implements OnInit {
  private userService = inject(UserService);
  private userContext = inject(UserContextService)
  readonly title = signal('');
  readonly userIdsRaw = signal('');

  allUsers = signal<UserDto.List[]>([]);
  selectedUserIds = signal<string[]>([]);

  // selectedUsers manuel tutmak yerine ID'lerden otomatik hesaplanır
  selectedUsers = computed(() => {
    const ids = this.selectedUserIds();
    return this.allUsers().filter(u => ids.includes(u.id));
  });


  ngOnInit(): void {
    this.isLoading.set(true);
    this.userService.getList().subscribe({
      next: (res) => {
        if (res.success) {
          this.allUsers.set(res.data.items.filter(f => f.id !== this.userContext.user$().NameIdentifier));
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  isUserSelected(userId: string): boolean {
    return this.selectedUserIds().includes(userId);
  }

  toggleUserSelection(userId: string): void {
    this.selectedUserIds.update(ids =>
      ids.includes(userId) ? ids.filter(id => id !== userId) : [...ids, userId]
    );
  }

  onConfirm(): void {
    if (!this.title().trim() || this.selectedUserIds().length === 0) return;

    this.confirm({
      title: this.title().trim(),
      userIds: this.selectedUserIds()
    });
  }
}