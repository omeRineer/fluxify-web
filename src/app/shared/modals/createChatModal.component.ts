import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/rest/user.service';
import { UserDto } from '../../core/models/entity/user.models';
import { CoreModalComponent } from '../../core/components/core-modal.component';
import { SpinnerComponent } from "../components/spinner.component";
import { UserContextService } from '../../core/services/common/userContext.service';

export interface CreateGroupResult {
    groupTitle: string;
    selectedUserIds: string[];
}

@Component({
    selector: 'app-create-group-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, SpinnerComponent],
    template: `
    <div class="modal-wrapper">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div>
            <h3 class="text-base font-semibold text-slate-100">Yeni Sohbet</h3>
          </div>
        </div>
        <button (click)="close()" class="fluxify-btn fluxify-btn-outline" title="Kapat">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body space-y-4">
        <!-- Grup Adı Input -->
        <div>
          <label class="input-label">Grup Adı</label>
          <div class="input-with-icon">
            <i class="fa-solid fa-user-group input-icon"></i>
            <input 
              type="text" 
              [(ngModel)]="groupTitle" 
              placeholder="Örn: Fluxify Frontend Ekibi"
              class="custom-input"
            />
          </div>
        </div>

        <div class="space-y-2">         

          <div class="user-select-list custom-scrollbar">
            @if (isLoading()) {
              <app-spinner></app-spinner>
            } @else {
              @for (user of filteredUsers(); track user.id) {
                <div 
                  (click)="toggleUserSelection(user.id)"
                  class="user-item"
                  [class.selected]="isUserSelected(user.id)"
                >
                  <div class="avatar">
                    {{ user.name.substring(0, 2).toUpperCase() }}
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h5 class="text-sm font-medium text-slate-200 truncate">{{ user.name }}</h5>
                    <p class="text-xs text-slate-400 truncate">{{ user.email }}</p>
                  </div>

                  <div class="checkbox-box" [class.checked]="isUserSelected(user.id)">
                    @if (isUserSelected(user.id)) {
                      <i class="fa-solid fa-check text-xs text-white"></i>
                    }
                  </div>
                </div>
              } @empty {
                <div class="p-6 text-center text-slate-500 text-xs">
                  Kullanıcı bulunamadı.
                </div>
              }
            }
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <!-- CoreModalComponent'ten gelen cancel() metodu -->
        <button (click)="cancel()" class="fluxify-btn fluxify-btn-outline">İptal</button>
        <button 
          (click)="createGroup()" 
          [disabled]="!groupTitle.trim() || selectedUserIds().length === 0 || isLoading()" 
          class="fluxify-btn fluxify-btn-primary"
        >
          <i class="fa-solid fa-plus text-xs mr-1.5"></i>
          Yeni Sohbet
        </button>
      </div>
    </div>
  `,
    styles: [`
    .modal-wrapper {
      background-color: #111625;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      color: #f8fafc;
      width: 100%;
      max-width: 480px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .close-btn {
      color: #64748b;
      font-size: 18px;
      padding: 4px 8px;
      border-radius: 8px;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-btn:hover {
      color: #f8fafc;
      background-color: rgba(255, 255, 255, 0.05);
    }

    .modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .input-label {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
      margin-bottom: 6px;
    }

    .input-with-icon {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      color: #64748b;
      font-size: 13px;
    }

    .custom-input {
      width: 100%;
      background-color: #0b0f19;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 9px 12px 9px 36px;
      font-size: 13px;
      color: #f8fafc;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .custom-input:focus {
      border-color: rgba(99, 102, 241, 0.6);
    }

    .selected-chips {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .chip-remove {
      color: #818cf8;
      font-size: 12px;
      line-height: 1;
    }

    .chip-remove:hover {
      color: #ffffff;
    }

    .user-select-list {
      max-height: 220px;
      overflow-y: auto;
      border: 1px solid #1e293b;
      border-radius: 12px;
      background-color: #0b0f19;
      divide-y: 1px solid rgba(255, 255, 255, 0.04);
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      cursor: pointer;
      transition: background-color 0.15s ease;
    }

    .user-item:hover {
      background-color: rgba(255, 255, 255, 0.03);
    }

    .user-item.selected {
      background-color: rgba(99, 102, 241, 0.08);
    }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      background-color: #1e293b;
      color: #818cf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .checkbox-box {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      margin-left: auto;
      border: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .checkbox-box.checked {
      background-color: #4f46e5;
      border-color: #4f46e5;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .btn-secondary {
      padding: 8px 16px;
      font-size: 13px;
      color: #94a3b8;
      border-radius: 10px;
    }

    .btn-secondary:hover {
      color: #f8fafc;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      padding: 8px 18px;
      font-size: 13px;
      color: #ffffff;
      background-color: #4f46e5;
      border-radius: 10px;
      transition: background-color 0.15s ease;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #6366f1;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class CreateChatModalComponent extends CoreModalComponent implements OnInit {
    private userService = inject(UserService);
    private userContext = inject(UserContextService)

    groupTitle: string = '';
    searchQuery: string = '';

    allUsers = signal<UserDto.List[]>([]);
    selectedUserIds = signal<string[]>([]);

    // selectedUsers manuel tutmak yerine ID'lerden otomatik hesaplanır
    selectedUsers = computed(() => {
        const ids = this.selectedUserIds();
        return this.allUsers().filter(u => ids.includes(u.id));
    });

    filteredUsers = computed(() => {
        const query = this.searchQuery.toLowerCase().trim();
        if (!query) return this.allUsers();
        return this.allUsers().filter(u =>
            u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
        );
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

    createGroup(): void {
        if (!this.groupTitle.trim() || this.selectedUserIds().length === 0) return;

        this.confirm({
            title: this.groupTitle.trim(),
            userIds: this.selectedUserIds()
        });
    }
}