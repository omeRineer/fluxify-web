import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isConnected: boolean = true;

  // İleride backend'e bağlayacağımız, şimdilik tıklayınca durumu değiştiren metod
  toggleConnection(): void {
    this.isConnected = !this.isConnected;
  }
}
