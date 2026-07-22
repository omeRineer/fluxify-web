import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar-component/sidebar-component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header-component/header-component';
import { PresenceSChannel } from '../../../core/services/hubs/presence-channel';

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
  presenceChannel = inject(PresenceSChannel)

  isSidebarOpen = true;

  ngOnInit(): void {
    this.presenceChannel.connect()
  }
}
