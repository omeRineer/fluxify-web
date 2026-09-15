import { Component, computed, inject, signal } from '@angular/core';
import { NotificationFacade } from '../../../core/services/facades/notification-facade.service';
import { NotificationStore } from '../../../core/services/stores/notification.store';
import { AppNotification, AppNotificationStatus } from '../../../core/models/store/notification.models';
import { CoreComponent } from '../../../core/components/core.component';
import { NotificationDetailModalComponent } from '../../../shared/modals/notification-detail-modal/notification-detail-modal';
import { TimeAgoPipe } from "../../../core/pipes/time-ago.pipe";
import { SpinnerComponent } from '../../../shared/components/spinner.component';

@Component({
  selector: 'app-notification-list',
  imports: [TimeAgoPipe, SpinnerComponent],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.scss',
})
export class NotificationList extends CoreComponent {
  notificationFacade = inject(NotificationFacade);
  notificationStore = inject(NotificationStore);
  typeFilters: { value: string, label: string }[] = [{ value: 'all', label: 'Tümü' }, { value: 'unread', label: 'Okunmamış' }]

  readonly selectedType = signal<string>('all');
  readonly filter = signal<string>('all');
  readonly isEmpty = signal<boolean>(false);
  readonly currentPage = computed(() => this.notificationFacade.currentPage());
  readonly visibleNotifications = computed(() => {
    const list = this.notificationStore.entities();
    return list.filter(n => !n.read).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  readonly badgeLabel = computed(() => {
    const count = this.notificationStore.unreadCount();
    return count > 9999 ? '9999+' : String(count);
  });

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

  onScroll(event: Event): void {
    console.log('Scroll event triggered:', event);
    const target = event.target as HTMLElement;
    if (!target) return;

    // Kalan mesafe 100px altına indiğinde ve yükleme devam etmiyorken tetikle
    const threshold = 100;
    const position = target.scrollTop + target.clientHeight;
    const height = target.scrollHeight;

    if (height - position <= threshold && !this.isLoading()) {
      this.loadNextPage();
    }
  }

  private loadNextPage(): void {
    this.isLoading.set(true);
    this.notificationFacade.currentPage.update(page => page + 1);

    this.notificationFacade.getPagedList(this.currentPage(), 10, false)
      .subscribe(res=> {
        this.isLoading.set(false);
      });
  }
}
