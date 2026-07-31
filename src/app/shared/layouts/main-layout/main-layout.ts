import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { NotificationPopover } from './components/header-component/components/notification-popover/notification-popover';
import { HeaderComponent } from './components/header-component/header-component';
import { PresenceHubService } from '../../../core/services/hubs/presence-hub.service';
import { AuthService } from '../../../core/services/rest/auth.service';
import { Subscription } from 'rxjs';
import { UserContextService } from '../../../core/services/common/userContext.service';
import { MeService } from '../../../core/services/rest/me.service';
import { NotificationStore } from '../../../core/services/stores/notification.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private userContext = inject(UserContextService)
  private meService = inject(MeService)
  private notificationStore = inject(NotificationStore)

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    const notificationSub = this.userContext.onSet$.subscribe(()=>{
      this.meService.getNotifications().subscribe(res => {
          const notifications = res.data.items.map(notification => ({
            id: notification.id,
            level: notification.level,
            title: notification.title,
            summary: notification.summary,
            timestamp: notification.createDate,
            url: notification.url,
            thumbnail: notification.thumbnail,
            read: notification.isRead
          }));
          this.notificationStore.load(notifications)

        })
    })

    this.subscriptions.add(notificationSub)
  }

}