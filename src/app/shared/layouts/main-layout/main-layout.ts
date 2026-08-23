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
import { NotificationFacade } from '../../../core/services/facades/notification-facade.service';

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
export class MainLayout implements OnInit {
  private readonly notificationFacade = inject(NotificationFacade)
  
  ngOnInit(): void {
    this.notificationFacade.initialize().subscribe()
  }

}