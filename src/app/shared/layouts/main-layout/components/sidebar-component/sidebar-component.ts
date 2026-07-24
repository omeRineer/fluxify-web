import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { NavItem } from '../../../../../core/models/ui/sidebar.models';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterModule,
    RouterLinkActive,
  ],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  menuItems: NavItem[] = [
    {
      title: 'Panel',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      title: 'Yönetim',
      icon: 'admin_panel_settings',
      children: [
        { title: 'Kullanıcılar', icon: 'people', route: '/admin/users' },
        { title: 'Roller', icon: 'verified_user', route: '/admin/roles' }
      ]
    },
    {
      title: 'Ayarlar',
      icon: 'settings',
      children: [
        { title: 'Genel Ayarlar', icon: 'tune', route: '/settings/general' },
        { title: 'Güvenlik', icon: 'security', route: '/settings/security' }
      ]
    }
  ];
}
