import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { TimeAgoPipe } from '../../../../../../../core/pipes/time-ago.pipe';
import { AppNotification, AppNotificationStatus } from '../../../../../../../core/models/store/notification.models';
import { NotificationStore } from '../../../../../../../core/services/stores/notification.store';
import { CoreComponent } from '../../../../../../../core/components/core.component';

@Component({
  selector: 'app-notification-popover',
  imports: [
    TimeAgoPipe
  ],
  templateUrl: './notification-popover.html',
  styleUrl: './notification-popover.scss',
})
export class NotificationPopover extends CoreComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly notificationStore = inject(NotificationStore);

  readonly isOpen = signal(false);
  readonly filter = signal<AppNotificationStatus>('all');

  readonly notifications = this.notificationStore.notifications$;
  readonly unreadCount = this.notificationStore.unreadCount;

  readonly visibleNotifications = computed(() => {
    const list = this.notifications();
    return this.filter() === 'unread' ? list.filter(n => !n.read) : list;
  });

  readonly badgeLabel = computed(() => {
    const count = this.unreadCount();
    return count > 9 ? '9+' : String(count);
  });

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }

  setFilter(mode: AppNotificationStatus): void {
    this.filter.set(mode);
  }

  select(notification: AppNotification): void {
    if (!notification.read) {
      this.notificationStore.markAsRead(notification.id);
    }
  }

  dismiss(event: MouseEvent, id: string): void {
    event.stopPropagation();
    this.notificationStore.dismiss(id);
  }

  markAllAsRead(): void {
    this.notificationStore.markAllAsRead();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
