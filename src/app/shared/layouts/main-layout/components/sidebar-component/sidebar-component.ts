import { Component } from '@angular/core';
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
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  menuItems: NavItem[] = [
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-chart-pie',
      route: '/dashboard'
    },
    {
      title: 'Sohbet',
      icon: 'fa-solid fa-comment',
      route: '/chat'
    }
  ];
}
