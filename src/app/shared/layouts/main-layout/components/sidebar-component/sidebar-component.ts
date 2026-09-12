import { Component, output, signal } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NavItem } from '../../../../../core/models/ui/sidebar.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    RouterLinkActive
  ],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.scss',
})
export class SidebarComponent {
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      route: '/dashboard'
    },
    {
      label: 'Bildirimler',
      icon: 'fa-solid fa-bell',
      route: '/notifications'
    },
    {
      label: 'Sohbet',
      icon: 'fa-solid fa-comment',
      route: '/chat'
    }
  ];
  readonly collapsed = signal(false);

  readonly collapsedChange = output<boolean>();

  toggleCollapsed(): void {
    this.collapsed.update(v => !v);
    this.collapsedChange.emit(this.collapsed());
  }
}
