import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class Stores {
  selectedRoom = signal<ChatRoom | null>(null);
}