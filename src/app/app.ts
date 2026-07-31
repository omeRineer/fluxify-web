import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreComponent } from './core/components/core.component';
import { PresenceHubService } from './core/services/hubs/presence-hub.service';
import { MeService } from './core/services/rest/me.service';
import { NotificationStore } from './core/services/stores/notification.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App extends CoreComponent {
  protected readonly presenceHub = inject(PresenceHubService)
  protected readonly meService = inject(MeService)
  protected readonly notificationStore = inject(NotificationStore)

  constructor() {
    super();
  }
}
