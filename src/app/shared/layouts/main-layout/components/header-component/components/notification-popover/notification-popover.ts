import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  computed,
  effect,
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
import { tap } from 'rxjs';

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
export class NotificationPopover extends CoreComponent implements OnInit {

  readonly host = inject(ElementRef<HTMLElement>);
  readonly notificationStore = inject(NotificationStore);
  readonly notificationFacade = inject(NotificationFacade);


  readonly isOpen = signal(false);
  readonly currentPage = signal(0);
  readonly hasMore = signal(true);

  readonly localNotifications = signal<AppNotification[]>([]);
  readonly visibleNotifications = computed(() => {
    const newNotifications = this.notificationStore.entities();
    const localNotifications = this.localNotifications();
    const readNotifications = this.notificationStore.reads();

    const uniqueNotifications = newNotifications.filter(
      newNotification => !localNotifications.some(localNotification => localNotification.id === newNotification.id)
    );
    const combinedNotifications = [...uniqueNotifications, ...localNotifications];
    return combinedNotifications.filter(n => !n.read && !readNotifications.some(x => x === n.id)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  readonly badgeLabel = computed(() => {
    const count = this.notificationStore.unreadCount();
    return count > 99 ? '99+' : String(count);
  });

  constructor(){
    super()

    effect(()=>{
      const currentNotifications = this.visibleNotifications()

      if(currentNotifications.length < 10 && !this.isLoading() && this.hasMore()){
        this.loadPage(this.currentPage() + 1)
      }
    })
  }

  ngOnInit(): void {
    this.loadPage(this.currentPage());
  }

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
      this.loadPage(this.currentPage() + 1);
    }
  }

  private loadPage(page: number): void {
    this.isLoading.set(true);
    const size = 10 + this.notificationStore.entities().length;

    this.notificationFacade.getList({ page: page, size: size, isRead: false }).subscribe({
      next: res => {
        if (res.success) {
          const notifications = res.data.data.map(notification => ({
            id: notification.id,
            sender: notification.sender,
            type: notification.type,
            title: notification.title,
            summary: notification.summary,
            date: notification.createDate,
            timestamp: notification.createDate,
            properties: notification.properties,
            thumbnail: notification.thumbnail,
            read: notification.isRead
          }));
          this.localNotifications.update(current => [...current, ...notifications]);

          this.currentPage.set(page);
          this.hasMore.set(res.data.data.length > 0);
        }
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }
}
