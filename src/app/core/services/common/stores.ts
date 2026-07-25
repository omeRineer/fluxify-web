import { Injectable, signal } from "@angular/core";
import { ChatDto } from "../../models/entity/chat.models";

@Injectable({ providedIn: 'root' })
export class Stores {
  selectedRoom = signal<ChatDto.List | null>(null);
}