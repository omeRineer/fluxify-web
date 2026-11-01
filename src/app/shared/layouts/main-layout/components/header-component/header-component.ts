import { Component, ElementRef, EventEmitter, HostListener, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../../../../core/services/rest/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserContextService } from '../../../../../core/services/common/userContext.service';
import { PresenceHubService } from '../../../../../core/services/hubs/presence-hub.service';
import { SmartDatePipe } from '../../../../../core/pipes/smart-date.pipe';
import { NotificationPopover } from "./components/notification-popover/notification-popover";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SmartDatePipe,
    NotificationPopover,
    RouterLink
],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService)
  userContext = inject(UserContextService)
  presenceHubService = inject(PresenceHubService)
  router = inject(Router)
  
  onLogout(){
    this.authService.logout()
    this.presenceHubService.disconnect()
    this.router.navigate(["/login"])
  }

  private readonly host = inject(ElementRef<HTMLElement>);
  readonly userMenuOpen = signal(false);


  toggleUserMenu(): void {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu(): void {
    this.userMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.userMenuOpen() && !this.host.nativeElement.contains(event.target as Node)) {
      this.closeUserMenu();
    }
  }
}
