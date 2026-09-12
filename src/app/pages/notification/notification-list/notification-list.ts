import { Component, computed, inject, signal } from '@angular/core';
import { NotificationFacade } from '../../../core/services/facades/notification-facade.service';
import { NotificationStore } from '../../../core/services/stores/notification.store';
import { AppNotification, AppNotificationStatus } from '../../../core/models/store/notification.models';
import { CoreComponent } from '../../../core/components/core.component';
import { NotificationDetailModalComponent } from '../../../shared/modals/notification-detail-modal/notification-detail-modal';
import { TimeAgoPipe } from "../../../core/pipes/time-ago.pipe";

@Component({
  selector: 'app-notification-list',
  imports: [TimeAgoPipe],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
})
export class NotificationList extends CoreComponent {
  notificationFacade = inject(NotificationFacade);
  notificationStore = inject(NotificationStore);
  typeFilters: { value: string, label: string }[] = [{ value: 'all', label: 'Tümü' }, { value: 'error', label: 'Hata' }, { value: 'warning', label: 'Uyarı' }, { value: 'info', label: 'Bilgi' }, { value: 'chat', label: 'Sohbet' }]

  readonly selectedType = signal<string>('all');
  readonly filter = signal<string>('all');
  readonly isEmpty = signal<boolean>(false);
  readonly visibleNotifications = computed(() => {
    const list = this.notificationStore.entities();
    return this.filter() === 'unread' ? list.filter(n => !n.read) : list;
  });

  readonly badgeLabel = computed(() => {
    const count = this.notificationStore.unreadCount();
    return count > 9 ? '9+' : String(count);
  });

  markAllAsRead(): void {
    this.notificationFacade.markAllAsRead();
  }

  setFilter(mode: AppNotificationStatus): void {
    this.filter.set(mode);
  }

  setTypeFilter(type: string): void {
    this.selectedType.set(type);
  }

  openDetail(notification: AppNotification): void {
    if (!notification.read) {
      this.notificationFacade.markAsRead(notification.id);
    }

    this.dialogService.open<NotificationDetailModalComponent, string>(NotificationDetailModalComponent, {
      width: '480px',
      data: notification.id
    })
  }

  dismiss(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.notificationFacade.dismiss(id);
  }
}
