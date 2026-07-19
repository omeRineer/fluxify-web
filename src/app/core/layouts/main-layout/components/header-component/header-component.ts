import { Component, EventEmitter, Output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [

  ],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent {
  isConnected = signal(true);

  // İleride backend'e bağlayacağımız, şimdilik tıklayınca durumu değiştiren metod
  toggleConnection(): void {
    this.isConnected.update((value) => !value);
  }
}
