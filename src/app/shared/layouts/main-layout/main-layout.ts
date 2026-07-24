import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header-component/header-component';
import { PresenceHubService } from '../../../core/services/hubs/presence-hub.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout implements OnInit {
  presenceHubService = inject(PresenceHubService)

  isSidebarOpen = true;

  ngOnInit(): void {
    this.presenceHubService.connect()
  }
}
