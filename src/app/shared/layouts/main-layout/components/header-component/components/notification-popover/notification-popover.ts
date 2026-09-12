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
import { RouterLink } from "@angular/router";
import { SpinnerComponent } from '../../../../../../components/spinner.component';

@Component({
  selector: 'app-notification-popover',
  imports: [
    TimeAgoPipe,
    RouterLink,
    SpinnerComponent
],
  templateUrl: './notification-popover.html',
  styleUrl: './notification-popover.scss',
})
export class NotificationPopover extends CoreComponent {
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly notificationStore = inject(NotificationStore);
  private readonly notificationFacade = inject(NotificationFacade);

  readonly isOpen = signal(false);
  readonly currentPage = signal(0);
  readonly hasMore = signal(true);

  readonly visibleNotifications = computed(() => {
    const list = this.notificationStore.entities();
    return list.filter(n => !n.read);
  });

  readonly badgeLabel = computed(() => {
    const count = this.notificationStore.unreadCount();
    return count > 99 ? '99+' : String(count);
  });

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  close(): void {
    this.isOpen.set(false);
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

  onScroll(event: Event): void {
    
    const target = event.target as HTMLElement;
    if (!target) return;

    // Alt sınıra 20px kala tetikle (threshold)
    const threshold = 20;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

    if (isAtBottom && !this.isLoading() && this.hasMore()) {
      this.loadNextPage();
    }
  }

  private loadNextPage(): void {
    this.isLoading.set(true);
    this.currentPage.update(page => page + 1);

    this.notificationFacade.getPagedList(this.currentPage(), 10, false)
      .subscribe(res=> {
        this.isLoading.set(false);
      });
  }
}
