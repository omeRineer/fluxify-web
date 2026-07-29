import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/rest/user.service';
import { UserDto } from '../../core/models/entity/user.models';
import { CoreModalComponent } from '../../core/components/core-modal.component';
import { SpinnerComponent } from "../components/spinner.component";
import { UserContextService } from '../../core/services/common/userContext.service';
import { CoreComponent } from '../../core/components/core.component';


@Component({
    selector: 'app-users-widget',
    standalone: true,
    imports: [CommonModule, FormsModule, SpinnerComponent],
    template: `
    <!-- Slate Midnight Widget Container -->
<div class="sm-widget">
  
  <!-- 1. Header / Kendi Profil Statün -->
  <div class="sm-header">
    <div class="sm-profile-group">
      <div class="sm-avatar-wrapper">
        <div class="sm-avatar sm-avatar-sky">AE</div>
        <span class="sm-badge sm-badge-online"></span>
      </div>

      <div class="sm-user-info">
        <h4 class="sm-user-name">Ahmet Erdem</h4>
        
        <!-- Status Selector -->
        <div class="sm-select-wrapper">
          <select class="sm-select">
            <option value="online">🟢 Çevrimiçi</option>
            <option value="busy">🔴 Meşgul</option>
            <option value="away">🟡 Dışarıda</option>
            <option value="offline">⚪ Gizli</option>
          </select>
          <i class="fa-solid fa-chevron-down sm-select-icon"></i>
        </div>
      </div>
    </div>

    <!-- Mute / Action Button -->
    <button type="button" class="sm-icon-btn" title="Bildirimleri Sessize Al">
      <i class="fa-solid fa-bell-slash"></i>
    </button>
  </div>

  <!-- 2. Ekip / Bağlantı Başlığı -->
  <div class="sm-list-header">
    <div class="sm-title-group">
      <span class="sm-title">Aktif Bağlantılar</span>
      <span class="sm-pill">8 Canlı</span>
    </div>

    <button type="button" class="sm-icon-btn-sm" title="Ara">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>

  <!-- 3. Kullanıcı Listesi -->
  <div class="sm-user-list">
    
    <!-- Online User -->
    <div class="sm-user-item">
      <div class="sm-avatar-wrapper">
        <div class="sm-avatar sm-avatar-sky">MY</div>
        <span class="sm-badge sm-badge-online"></span>
      </div>
      <div class="sm-item-content">
        <div class="sm-item-top">
          <span class="sm-item-name">Mehmet Yılmaz</span>
          <span class="sm-time">Şimdi</span>
        </div>
        <p class="sm-item-desc">SignalR hub entegrasyonu...</p>
      </div>
    </div>

    <!-- Busy User -->
    <div class="sm-user-item">
      <div class="sm-avatar-wrapper">
        <div class="sm-avatar sm-avatar-rose">ZK</div>
        <span class="sm-badge sm-badge-busy"></span>
      </div>
      <div class="sm-item-content">
        <div class="sm-item-top">
          <span class="sm-item-name">Zeynep Kaya</span>
          <span class="sm-time sm-time-busy">Meşgul</span>
        </div>
        <p class="sm-item-desc">Toplantıda • DND</p>
      </div>
    </div>

    <!-- Away User -->
    <div class="sm-user-item">
      <div class="sm-avatar-wrapper">
        <div class="sm-avatar sm-avatar-amber">CS</div>
        <span class="sm-badge sm-badge-away"></span>
      </div>
      <div class="sm-item-content">
        <div class="sm-item-top">
          <span class="sm-item-name">Can Sevim</span>
          <span class="sm-time">15dk</span>
        </div>
        <p class="sm-item-desc">Mola / Yemekte</p>
      </div>
    </div>

    <!-- Offline User -->
    <div class="sm-user-item sm-offline">
      <div class="sm-avatar-wrapper">
        <div class="sm-avatar sm-avatar-slate">ED</div>
        <span class="sm-badge sm-badge-offline"></span>
      </div>
      <div class="sm-item-content">
        <div class="sm-item-top">
          <span class="sm-item-name">Elif Demir</span>
          <span class="sm-time">Çevrimdışı</span>
        </div>
        <p class="sm-item-desc">Dün 18:30</p>
      </div>
    </div>

  </div>

</div>
  `,
    styles: [`
.sm-widget {
  width: 100%;
  max-width: 360px;
  background-color: rgba(2, 6, 23, 0.95); /* slate-950 */
  border: 1px solid rgba(30, 41, 59, 0.8); /* slate-800 */
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #f8fafc;
  box-sizing: border-box;
}

/* 1. Header Stilleri */
.sm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(30, 41, 59, 0.8);
}

.sm-profile-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sm-user-info {
  display: flex;
  flex-direction: column;
}

.sm-user-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.2;
}

/* Custom Status Select Box */
.sm-select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-top: 4px;
}

.sm-select {
  background-color: #0f172a; /* slate-900 */
  border: 1px solid #1e293b; /* slate-800 */
  color: #cbd5e1; /* slate-300 */
  font-size: 11px;
  font-weight: 500;
  border-radius: 6px;
  padding: 4px 24px 4px 8px;
  appearance: none;
  outline: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sm-select:hover {
  background-color: #1e293b;
  border-color: #334155;
}

.sm-select:focus {
  border-color: #38bdf8; /* sky-400 */
}

.sm-select option {
  background-color: #020617;
  color: #cbd5e1;
}

.sm-select-icon {
  position: absolute;
  right: 8px;
  font-size: 9px;
  color: #64748b;
  pointer-events: none;
}

/* İkon Butonları */
.sm-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #0f172a;
  border: 1px solid #1e293b;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.15s ease;
}

.sm-icon-btn:hover {
  background-color: #1e293b;
  color: #38bdf8;
}

.sm-icon-btn-sm {
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
  border-radius: 4px;
  transition: color 0.15s ease;
}

.sm-icon-btn-sm:hover {
  color: #cbd5e1;
}

/* 2. Liste Başlığı */
.sm-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.sm-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sm-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.sm-pill {
  font-size: 10px;
  font-weight: 600;
  background-color: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

/* 3. Liste ve Kullanıcı Elemanları */
.sm-user-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 4px;
}

.sm-user-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  background-color: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(30, 41, 59, 0.4);
  cursor: pointer;
  transition: all 0.15s ease;
}

.sm-user-item:hover {
  background-color: #0f172a;
  border-color: rgba(51, 65, 85, 0.8);
}

.sm-item-content {
  flex: 1;
  min-width: 0;
}

.sm-item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sm-item-name {
  font-size: 12px;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s ease;
}

.sm-user-item:hover .sm-item-name {
  color: #38bdf8;
}

.sm-time {
  font-size: 10px;
  font-family: monospace;
  color: #64748b;
}

.sm-time-busy {
  color: #f43f5e;
}

.sm-item-desc {
  margin: 2px 0 0 0;
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Offline Kullanıcı Durumu */
.sm-offline {
  opacity: 0.5;
}

.sm-offline:hover {
  opacity: 0.9;
}

/* Avatarlar & Statü Rozetleri */
.sm-avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.sm-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #020617;
  border: 1px solid #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.sm-avatar-sky { color: #38bdf8; }
.sm-avatar-rose { color: #fb7185; }
.sm-avatar-amber { color: #fbbf24; }
.sm-avatar-slate { color: #64748b; }

.sm-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #020617;
}

.sm-badge-online { background-color: #10b981; }
.sm-badge-busy { background-color: #f43f5e; }
.sm-badge-away { background-color: #f59e0b; }
.sm-badge-offline { background-color: #64748b; }

/* Slate Midnight Scrollbar */
.sm-user-list::-webkit-scrollbar {
  width: 4px;
}

.sm-user-list::-webkit-scrollbar-track {
  background: transparent;
}

.sm-user-list::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 4px;
}

.sm-user-list::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
  `]
})
export class UsersWidgetComponent extends CoreComponent implements OnInit {
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
}