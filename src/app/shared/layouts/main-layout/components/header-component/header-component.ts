import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { AuthService } from '../../../../../core/services/rest/auth.service';
import { Router } from '@angular/router';
import { UserContextService } from '../../../../../core/services/common/userContext.service';
import { PresenceHubService } from '../../../../../core/services/hubs/presence-hub.service';
import { SmartDatePipe } from '../../../../../core/pipes/smart-date.pipe';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SmartDatePipe
  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  authService = inject(AuthService)
  userContext = inject(UserContextService)
  presenceHubService = inject(PresenceHubService)
  router = inject(Router)
  
  onLogout(){
    this.authService.logout()
    this.router.navigate(["/login"])
  }
}
