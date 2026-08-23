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
import { NotificationFacade } from '../../../../../../../core/services/facades/notification-facade.service';
import { NotificationDetailModalComponent } from '../../../../../../modals/notification-detail-modal/notification-detail-modal';

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
  readonly notificationStore = inject(NotificationStore);
  private readonly notificationFacade = inject(NotificationFacade);

  readonly isOpen = signal(false);
  readonly filter = signal<AppNotificationStatus>('all');

  readonly visibleNotifications = computed(() => {
    const list = this.notificationStore.entities();
    return this.filter() === 'unread' ? list.filter(n => !n.read) : list;
  });

  readonly badgeLabel = computed(() => {
    const count = this.notificationStore.unreadCount();
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

  markAllAsRead(): void {
    this.notificationFacade.markAllAsRead();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    const isInsideHost = this.host.nativeElement.contains(target);

    const isInsideOverlay = target.closest('.notification-close');

    if (!isInsideHost && !isInsideOverlay) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }
}
