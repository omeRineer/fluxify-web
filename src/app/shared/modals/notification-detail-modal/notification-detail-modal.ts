import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CoreModalComponent } from '../../../core/components/core-modal.component';
import { NotificationFacade } from '../../../core/services/facades/notification-facade.service';
import { AppNotification } from '../../../core/models/store/notification.models';
import { TimeAgoPipe } from "../../../core/pipes/time-ago.pipe";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpinnerComponent } from "../../components/spinner.component";
import { SmartDatePipe } from '../../../core/pipes/smart-date.pipe';

@Component({
  selector: 'app-notification-detail-modal',
  imports: [SmartDatePipe, SpinnerComponent],
  templateUrl: './notification-detail-modal.html',
  styleUrl: './notification-detail-modal.scss',
})
export class NotificationDetailModalComponent extends CoreModalComponent implements OnInit {
  readonly notificationFacade = inject(NotificationFacade)
  private destroyRef = inject(DestroyRef);
  notification = signal<AppNotification | null>(null);


  ngOnInit(): void {
    this.isLoading.set(true)
    this.notificationFacade.get(this.data)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
        next: (res) => {
          this.notification.set({
            id: res.data.id,
            sender: res.data.sender,
            level: res.data.level,
            title: res.data.title,
            summary: res.data.summary,
            timestamp: res.data.createDate,
            url: res.data.url,
            thumbnail: res.data.thumbnail,
            read: res.data.isRead
          });
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
  }
}
