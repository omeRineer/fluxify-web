import { Component, computed, effect, ElementRef, inject, signal, untracked, ViewChild } from '@angular/core';
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

  @ViewChild('notificationScroll') scrollContainer!: ElementRef<HTMLElement>;

  notificationFacade = inject(NotificationFacade);
  notificationStore = inject(NotificationStore);
  typeFilters: { value: boolean, label: string }[] = [{ value: false, label: 'Okunmamış' }, { value: true, label: 'Okunmuş' }]

  readonly localNotifications = signal<AppNotification[]>([]);
  readonly visibleNotifications = computed(() => {
    const readNotifications = this.notificationStore.reads();

    return this.localNotifications().map(m => ({
      ...m,
      read: m.read || readNotifications.some(x => x === m.id) ? m.read = true : m.read = false
    }))
  })

  readonly selectedType = signal<boolean>(false);
  readonly isEmpty = signal<boolean>(false);
  readonly hasMore = signal<boolean>(true);
  readonly currentPage = signal<number>(0);
  readonly startDate = signal<string>('');
  readonly endDate = signal<string>('');

  readonly badgeLabel = computed(() => {
    const count = this.notificationStore.unreadCount();
    return count > 9999 ? '9999+' : String(count);
  });

  constructor() {
    super();

    effect(() => {
      const type = this.selectedType();
      const start = this.startDate();
      const end = this.endDate();

      untracked(() => {
        this.fetchNotifications(0, true);
      });
    }, { allowSignalWrites: true });

    effect(() => {
      const storeEntities = this.notificationStore.entities();
      const isUnreadSelected = !this.selectedType(); // false ise Okunmamışlar seçilidir

      // Sadece 'Okunmamışlar' sekmesindeysek ve Store'da veri varsa birleştir
      if (isUnreadSelected && storeEntities.length > 0) {
        untracked(() => {
          const storeNotifications = this.notificationStore.entities();
          const newNotifications = storeNotifications.filter(n => !n.read && !this.localNotifications().some(local => local.id === n.id));

          this.localNotifications.update(prev => [...newNotifications, ...prev]);
        });
      }
    });
  }

  fetchNotifications(page: number, isReset: boolean = false): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    const size = 10 + this.notificationStore.entities().length;

    this.notificationFacade.getList({ page, size: size, isRead: this.selectedType() }).subscribe({
      next: res => {
        this.currentPage.set(page);
        const notifications = res.data.data.map(notification => ({
          id: notification.id,
          sender: notification.sender,
          date: notification.createDate,
          type: notification.type,
          title: notification.title,
          summary: notification.summary,
          timestamp: notification.createDate,
          properties: notification.properties,
          thumbnail: notification.thumbnail,
          read: notification.isRead
        }));

        if (isReset) {
          this.localNotifications.set(notifications);
          if (this.scrollContainer?.nativeElement) {
            this.scrollContainer.nativeElement.scrollTop = 0;
          }
        } else {
          // Append / Infinite Scroll eklemesi
          this.localNotifications.update(prev => [...prev, ...notifications]);
        }

        this.hasMore.set(notifications.length >= 10);
        this.isLoading.set(false);
      }
    })
  }

  setType(type: boolean): void {
    this.selectedType.set(type);
  }

  resetFilters(): void {
    this.selectedType.set(false);
    this.startDate.set('');
    this.endDate.set('');
  }

  onStartDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.startDate.set(target.value);
  }

  onEndDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.endDate.set(target.value);
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
    const target = event.target as HTMLElement;
    if (!target || this.isLoading() || !this.hasMore()) return;

    // Kalan mesafe 100px altına indiğinde ve yükleme devam etmiyorken tetikle
    const threshold = 100;
    const position = target.scrollTop + target.clientHeight;
    const height = target.scrollHeight;

    if (height - position <= threshold && !this.isLoading()) {
      this.loadNextPage();
    }
  }

  private loadNextPage(): void {
    this.currentPage.update(page => page + 1);

    this.fetchNotifications(this.currentPage(), false);
  }
}
